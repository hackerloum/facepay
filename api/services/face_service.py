"""Face embedding extraction and matching using DeepFace."""

import base64
import tempfile
import uuid
from pathlib import Path

import numpy as np
from deepface import DeepFace

from config import settings
from services.supabase_service import get_supabase

# Cosine similarity threshold for face match
MATCH_THRESHOLD = 0.75


def _decode_base64_to_temp_file(image_base64: str) -> Path:
    """Decode base64 image to a temporary file. Handles data URL prefix."""
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    data = base64.b64decode(image_base64)
    suffix = ".jpg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        suffix = ".png"
    path = Path(tempfile.gettempdir()) / f"facepay_{uuid.uuid4()}{suffix}"
    path.write_bytes(data)
    return path


def extract_embedding(image_base64: str) -> list[float]:
    """Extract 128-d face embedding from base64 image using DeepFace Facenet."""
    path = _decode_base64_to_temp_file(image_base64)
    try:
        result = DeepFace.represent(
            img_path=str(path),
            model_name="Facenet",
            enforce_detection=True,
        )
        if not result:
            raise ValueError("No face detected in image")
        embedding = result[0]["embedding"]
        return embedding
    finally:
        path.unlink(missing_ok=True)


def match_face(image_base64: str) -> dict | None:
    """
    Match incoming face against all stored embeddings.
    Returns best match dict with user data if similarity >= threshold, else None.
    """
    incoming = np.array(extract_embedding(image_base64), dtype=np.float32)
    supabase = get_supabase()
    response = supabase.table("users").select("id, name, phone, phone_network, face_image_url, face_embedding").execute()
    users = response.data or []

    best_match = None
    best_similarity = 0.0

    for user in users:
        stored = user.get("face_embedding")
        if not stored:
            continue
        stored_arr = np.array(stored, dtype=np.float32)
        # Cosine similarity
        norm_in = np.linalg.norm(incoming)
        norm_stored = np.linalg.norm(stored_arr)
        if norm_in == 0 or norm_stored == 0:
            continue
        similarity = float(np.dot(incoming, stored_arr) / (norm_in * norm_stored))
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = user

    if best_similarity >= MATCH_THRESHOLD and best_match:
        return {
            "matched": True,
            "customer": {
                "id": best_match["id"],
                "name": best_match["name"],
                "phone": best_match["phone"],
                "phone_network": best_match["phone_network"],
                "face_image_url": best_match.get("face_image_url"),
            },
            "confidence": round(best_similarity, 4),
        }
    return None


def _get_raw_bytes(image_base64: str) -> bytes:
    """Extract raw bytes from base64 string, handling data URL prefix."""
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]
    return base64.b64decode(image_base64)


def register_face(image_base64: str, name: str, phone: str, phone_network: str) -> dict:
    """
    Register a new customer: save image to Storage, extract embedding, insert into users.
    Returns { user_id, face_image_url }.
    """
    embedding = extract_embedding(image_base64)
    raw = _get_raw_bytes(image_base64)

    supabase = get_supabase()
    file_name = f"{uuid.uuid4()}.jpg"
    supabase.storage.from_("face-images").upload(
        file_name,
        raw,
        {"content-type": "image/jpeg"},
    )
    public_url = supabase.storage.from_("face-images").get_public_url(file_name)

    insert_response = supabase.table("users").insert(
        {
            "name": name,
            "phone": phone,
            "phone_network": phone_network,
            "face_image_url": public_url,
            "face_embedding": embedding,
        }
    ).execute()

    if not insert_response.data:
        raise ValueError("Failed to insert user")
    user = insert_response.data[0]
    return {"user_id": user["id"], "face_image_url": public_url}

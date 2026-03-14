"""Face matching and registration routes."""

from fastapi import APIRouter, HTTPException

from models import (
    MatchFaceRequest,
    MatchFaceResponse,
    RegisterFaceRequest,
    RegisterFaceResponse,
    CustomerInfo,
)
from services.face_service import register_face as register_face_svc, match_face as match_face_svc

router = APIRouter(prefix="/api", tags=["face"])


@router.post("/register-face", response_model=RegisterFaceResponse)
async def register_face(req: RegisterFaceRequest):
    """Register a new customer with face image. Extracts embedding via DeepFace and stores in Supabase."""
    try:
        result = register_face_svc(
            image_base64=req.image_base64,
            name=req.name,
            phone=req.phone,
            phone_network=req.phone_network,
        )
        return RegisterFaceResponse(
            user_id=result["user_id"],
            face_image_url=result.get("face_image_url"),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/customer")
async def get_customer_by_phone(phone: str):
    """Get customer profile and transactions by phone. For dashboard lookup."""
    from services.supabase_service import get_supabase
    supabase = get_supabase()
    user_resp = supabase.table("users").select("*").eq("phone", phone).single().execute()
    if not user_resp.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    user = user_resp.data
    tx_resp = supabase.table("transactions").select("*").eq("customer_id", user["id"]).order("created_at", desc=True).limit(20).execute()
    return {"user": user, "transactions": tx_resp.data or []}


@router.post("/match-face", response_model=MatchFaceResponse)
async def match_face(req: MatchFaceRequest):
    """Match incoming face image against registered customers. Returns best match if above threshold."""
    try:
        result = match_face_svc(
            image_base64=req.image_base64,
        )
        if result and result.get("matched"):
            return MatchFaceResponse(
                matched=True,
                customer=CustomerInfo(**result["customer"]),
                confidence=result["confidence"],
            )
        return MatchFaceResponse(matched=False)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

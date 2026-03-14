"""Pydantic request/response models for FacePay API."""

from pydantic import BaseModel, Field


# --- Face routes ---

class RegisterFaceRequest(BaseModel):
    """Request to register a new customer with face embedding."""

    image_base64: str = Field(..., description="Base64-encoded face image (with or without data URL prefix)")
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=10)
    phone_network: str = Field(..., pattern="^(TZ-AIRTEL-C2B|TZ-TIGO-C2B|TZ-HALOTEL-C2B)$")


class RegisterFaceResponse(BaseModel):
    """Response after successful face registration."""

    user_id: str
    face_image_url: str | None = None


class MatchFaceRequest(BaseModel):
    """Request to match a face against registered customers."""

    image_base64: str = Field(..., description="Base64-encoded face image from camera")
    merchant_id: str = Field(..., description="UUID of the merchant performing the scan")


class CustomerInfo(BaseModel):
    """Matched customer information."""

    id: str
    name: str
    phone: str
    phone_network: str
    face_image_url: str | None = None


class MatchFaceResponse(BaseModel):
    """Response from face matching."""

    matched: bool
    customer: CustomerInfo | None = None
    confidence: float | None = None


# --- Payment routes ---

class InitiatePaymentRequest(BaseModel):
    """Request to initiate a Tembo MOMO collection."""

    customer_id: str
    merchant_id: str
    amount: float = Field(..., gt=0)
    currency: str = "TZS"


class InitiatePaymentResponse(BaseModel):
    """Response with transaction ID for polling."""

    transaction_id: str
    status: str = "PENDING"


class TransactionStatusResponse(BaseModel):
    """Transaction status for polling."""

    id: str
    status: str
    amount: float
    currency: str
    customer_id: str | None = None
    merchant_id: str | None = None
    tembo_reference: str | None = None
    created_at: str | None = None


# --- Webhook (Tembo callback) ---
# Tembo sends: statusCode, transactionId, transactionRef
# We parse these in the webhook handler; no Pydantic model needed for incoming webhook

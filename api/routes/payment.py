"""Payment initiation and status routes."""

from fastapi import APIRouter, HTTPException

from config import settings
from models import (
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    TransactionStatusResponse,
)
from services.supabase_service import get_supabase
from services.tembo_service import initiate_collection

router = APIRouter(prefix="/api", tags=["payment"])


@router.post("/initiate-payment", response_model=InitiatePaymentResponse)
async def initiate_payment(req: InitiatePaymentRequest):
    """Create transaction and initiate Tembo MOMO collection. Returns transaction ID for polling."""
    supabase = get_supabase()

    # Fetch customer and merchant
    customer_resp = supabase.table("users").select("phone, phone_network").eq("id", req.customer_id).single().execute()
    merchant_resp = supabase.table("merchants").select("shop_name, tembo_account_id").eq("id", req.merchant_id).single().execute()

    if not customer_resp.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not merchant_resp.data:
        raise HTTPException(status_code=404, detail="Merchant not found")

    customer = customer_resp.data
    merchant = merchant_resp.data
    account_id = merchant.get("tembo_account_id") or settings.tembo_account_id
    if not account_id:
        raise HTTPException(status_code=400, detail="Merchant has no Tembo account configured")

    # Create transaction
    tx_resp = supabase.table("transactions").insert(
        {
            "customer_id": req.customer_id,
            "merchant_id": req.merchant_id,
            "amount": req.amount,
            "currency": req.currency,
            "status": "PENDING",
            "channel": customer["phone_network"],
        }
    ).execute()

    if not tx_resp.data:
        raise HTTPException(status_code=500, detail="Failed to create transaction")
    tx = tx_resp.data[0]
    tx_id = tx["id"]
    transaction_ref = f"FacePay-{tx_id}"

    callback_url = f"{settings.api_base_url.rstrip('/')}/api/webhook/tembo"

    try:
        tembo_result = initiate_collection(
            msisdn=customer["phone"],
            amount=int(req.amount),
            channel=customer["phone_network"],
            transaction_ref=transaction_ref,
            narration=f"Payment at {merchant['shop_name']} via FacePay",
            callback_url=callback_url,
            account_id=account_id,
        )
    except Exception as e:
        supabase.table("transactions").update({"status": "FAILED"}).eq("id", tx_id).execute()
        raise HTTPException(status_code=502, detail=f"Tembo API error: {str(e)}")

    tembo_tx_id = tembo_result.get("transactionId")
    if tembo_tx_id:
        supabase.table("transactions").update({"tembo_reference": tembo_tx_id}).eq("id", tx_id).execute()

    return InitiatePaymentResponse(transaction_id=tx_id, status="PENDING")


@router.get("/transaction/{transaction_id}", response_model=TransactionStatusResponse)
async def get_transaction_status(transaction_id: str):
    """Poll transaction status. Used by mobile app for real-time updates."""
    supabase = get_supabase()
    resp = supabase.table("transactions").select("*").eq("id", transaction_id).single().execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    tx = resp.data
    return TransactionStatusResponse(
        id=tx["id"],
        status=tx["status"],
        amount=float(tx["amount"]),
        currency=tx.get("currency", "TZS"),
        customer_id=tx.get("customer_id"),
        merchant_id=tx.get("merchant_id"),
        tembo_reference=tx.get("tembo_reference"),
        created_at=tx.get("created_at"),
    )

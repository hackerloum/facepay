"""Webhook routes for external callbacks."""

from fastapi import APIRouter, Request

from services.tembo_service import update_transaction_status

router = APIRouter(prefix="/api", tags=["webhook"])


@router.post("/webhook/tembo")
async def tembo_webhook(request: Request):
    """
    Tembo callback when payment completes. Receives statusCode, transactionId, transactionRef.
    Returns 200 OK to acknowledge receipt.
    """
    body = await request.json()
    status_code = body.get("statusCode", "")
    transaction_ref = body.get("transactionRef", "")

    if transaction_ref:
        update_transaction_status(
            transaction_ref=transaction_ref,
            tembo_status=status_code,
        )
    return {"received": True}

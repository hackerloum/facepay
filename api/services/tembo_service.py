"""Tembo MOMO collection API integration."""

import uuid
from datetime import datetime, timezone

import httpx

from config import settings
from services.supabase_service import get_supabase

TEMBO_STATUS_SUCCESS = "PAYMENT_ACCEPTED"


def initiate_collection(
    msisdn: str,
    amount: int,
    channel: str,
    transaction_ref: str,
    narration: str,
    callback_url: str,
    account_id: str | None = None,
) -> dict:
    """
    Initiate Tembo MOMO collection. Sends USSD push to customer.
    Returns { transactionId, transactionRef, statusCode } or raises on error.
    """
    account_id = account_id or settings.tembo_account_id
    url = f"{settings.tembo_base_url.rstrip('/')}/collection"
    headers = {
        "x-request-id": str(uuid.uuid4()),
        "x-secret-key": settings.tembo_secret_key,
        "x-account-id": account_id,
        "Content-Type": "application/json",
    }
    body = {
        "msisdn": msisdn,
        "amount": amount,
        "channel": channel,
        "transactionRef": transaction_ref,
        "narration": narration,
        "transactionDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "callbackUrl": callback_url,
    }
    with httpx.Client() as client:
        resp = client.post(url, json=body, headers=headers, timeout=30.0)
        resp.raise_for_status()
        return resp.json()


def update_transaction_status(transaction_ref: str, tembo_status: str) -> str | None:
    """
    Map transactionRef (e.g. FacePay-{uuid}) to internal id and update status.
    Returns internal transaction id or None.
    """
    if not transaction_ref.startswith("FacePay-"):
        return None
    internal_id = transaction_ref.replace("FacePay-", "")
    status = "SUCCESS" if tembo_status == TEMBO_STATUS_SUCCESS else "FAILED"
    supabase = get_supabase()
    supabase.table("transactions").update({"status": status}).eq("id", internal_id).execute()
    return internal_id

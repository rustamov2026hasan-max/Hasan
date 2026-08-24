import os
import requests
import logging
from typing import Optional

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        # Telegram API Setup
        self.telegram_token = os.getenv("TELEGRAM_BOT_TOKEN", "mock_telegram_token")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID", "mock_chat_id")
        
        # Uzbek SMS Gateway Setup (e.g., Eskiz.uz or PlayMobile)
        self.sms_gateway_url = os.getenv("SMS_GATEWAY_URL", "https://notify.eskiz.uz/api/message/sms/send")
        self.sms_api_key = os.getenv("SMS_API_KEY", "mock_sms_api_key")

    def send_telegram_message(self, message: str) -> bool:
        """Sends a real-time alert via Telegram Bot API."""
        if self.telegram_token == "mock_telegram_token":
            logger.info(f"[MOCK TELEGRAM] Would send: {message}")
            return True
            
        url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
        payload = {
            "chat_id": self.telegram_chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        try:
            response = requests.post(url, json=payload, timeout=5)
            response.raise_for_status()
            logger.info("Telegram notification sent successfully.")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Telegram API Error: {e}")
            return False

    def send_sms_alert(self, phone_number: str, message: str) -> bool:
        """Fallback: Sends an SMS alert via Uzbek SMS Gateway."""
        if self.sms_api_key == "mock_sms_api_key":
            logger.info(f"[MOCK SMS] Would send to {phone_number}: {message}")
            return True

        headers = {
            "Authorization": f"Bearer {self.sms_api_key}"
        }
        payload = {
            "mobile_phone": phone_number,
            "message": message,
            "from": "4546" # Typical shortcode for info SMS in UZ
        }
        try:
            response = requests.post(self.sms_gateway_url, headers=headers, data=payload, timeout=5)
            response.raise_for_status()
            logger.info(f"SMS notification sent to {phone_number}.")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"SMS Gateway Error: {e}")
            return False

    def notify_anomaly(self, cattle_id: str, issue: str, phone_number: Optional[str] = None):
        """
        Primary notification logic:
        Tries Telegram first. If it fails or is unavailable, falls back to SMS.
        """
        alert_msg = (
            f"🚨 *CHORVA KUZATUV DIQQAT!* 🚨\n\n"
            f"🐄 *Hayvon ID:* `{cattle_id}`\n"
            f"⚠️ *Holat:* {issue}\n\n"
            f"Iltimos, zudlik bilan chorva holatini xaritadan tekshiring!"
        )
        
        logger.info(f"Triggering anomaly notification for cattle {cattle_id}")
        
        # 1. Try Telegram First (Fast & Free)
        telegram_success = self.send_telegram_message(alert_msg)
        
        # 2. Fallback to SMS if Telegram fails and phone_number is provided
        if not telegram_success and phone_number:
            logger.warning("Telegram failed or unavailable. Falling back to SMS notification...")
            # Convert markdown to plain text for SMS compatibility
            plain_msg = alert_msg.replace('*', '').replace('`', '')
            self.send_sms_alert(phone_number, plain_msg)

# Singleton instance for easy import in other files
notification_service = NotificationService()

'use client';
import Script from 'next/script';

// BEP widget embed.
// next/script renders a real <script> element in the HTML so document.currentScript
// is correctly set when the widget loader runs and reads its own data-* attributes.
export default function BepWidget() {
  return (
    <Script
      id="chatbot-initials-script"
      src="https://platform.botscrew.net/widget/script-chatbot.js"
      data-server-url="https://platform.botscrew.net/api"
      data-bot-id="fae15a5c-0783-421f-b012-7934a7773b73"
      strategy="afterInteractive"
    />
  );
}

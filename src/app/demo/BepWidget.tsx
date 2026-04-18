'use client';
import { useEffect } from 'react';

export default function BepWidget() {
  useEffect(() => {
    // Guard against double-mount in React strict mode
    if (document.getElementById('chatbot-initials-script')) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'chatbot-initials-script'; // BEP reads this id to find data-* attrs
    script.src = 'https://platform.botscrew.net/widget/script-chatbot.js';
    script.setAttribute('data-server-url', 'https://platform.botscrew.net/api');
    script.setAttribute('data-bot-id', 'fae15a5c-0783-421f-b012-7934a7773b73');
    document.body.appendChild(script);
  }, []);

  return null;
}

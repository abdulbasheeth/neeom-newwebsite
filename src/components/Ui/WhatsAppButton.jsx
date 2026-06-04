import React from 'react';

const WhatsAppButton = ({ phoneNumber, message, position = 'bottom-6 right-6' }) => {
  // Format phone number: remove spaces, dashes, plus sign (keep only digits)
  const formattedNumber = phoneNumber.replace(/[\s\-+]/g, '');
  
  // Optional pre-filled message (URL encoded)
  const whatsappUrl = message
    ? `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${formattedNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${position} bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2`}
      aria-label="Chat on WhatsApp"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28px"
        height="28px"
        fill="currentColor"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 2.13.6 4.13 1.69 5.86L2.05 21.2c-.26.65.37 1.28 1.02 1.02l3.34-1.64C7.87 21.4 9.87 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.77 0-3.44-.52-4.84-1.42l-.35-.21-2.62 1.29 1.29-2.62-.21-.35C5.52 15.44 5 13.77 5 12c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7z"/>
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      </svg>
    </a>
  );
};

export default  WhatsAppButton;
import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const CallButton = ({ phoneNumber, position = "bottom-22 left-7" }) => {
  const cleanPhoneNumber = phoneNumber.replace(/[\s\-]/g, '');
  const telLink = `tel:${cleanPhoneNumber}`;

  return (
    <a
      href={telLink}
      className={`fixed ${position} bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110`}
      aria-label="Call us"
    >
      <FaPhoneAlt size={21} color="white" />
    </a>
  );
};

export default CallButton;
import React, { useEffect, useState } from 'react';
import { CheckIcon } from './Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger fade-in animation
    const timer = setTimeout(() => {
      setVisible(false); // Trigger fade-out animation
      setTimeout(onClose, 300); // Allow time for fade-out before unmounting
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-full shadow-2xl shadow-green-500/30 flex items-center gap-3 transition-all duration-300 z-50
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <CheckIcon className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};
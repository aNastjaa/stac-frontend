import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import "../css/successModal.css";

const SuccessModal = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); 
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    _jsx("div", {
      className: "success-modal",
      "data-testid": "success-modal",  
      children: _jsx("div", {
        className: "success-modal-content",
        children: _jsx("p", {
          "data-testid": "success-modal-message", 
          children: message
        })
      })
    })
  );
};

export default SuccessModal;

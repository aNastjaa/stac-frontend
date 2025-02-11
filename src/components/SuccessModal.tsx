import { useState, useEffect } from 'react';
import "../css/successModal.css"

const SuccessModal = ({ message }: { message: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer when component unmounts or changes
  }, []);

  if (!isVisible) return null; // Return null if not visible

  return (
    <div data-testid="success-modal"  className="success-modal">
      <div className="success-modal-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;

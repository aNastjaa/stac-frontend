import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import "../css/successModal.css";
const SuccessModal = ({ message }) => {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false); // Hide after 5 seconds
        }, 5000);
        return () => clearTimeout(timer); // Cleanup timer when component unmounts or changes
    }, []);
    if (!isVisible)
        return null; // Return null if not visible
    return (_jsx("div", { className: "success-modal", children: _jsx("div", { className: "success-modal-content", children: _jsx("p", { children: message }) }) }));
};
export default SuccessModal;

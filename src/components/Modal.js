import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ show, onClose, onSubmit, imageFile, setImageFile, description, setDescription, }) => {
    if (!show)
        return null;
    return (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content", children: [_jsx("button", { className: "close-button", onClick: onClose, children: "\u00D7" }), _jsx("h2", { children: "Submit Your Artwork" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsxs("div", { className: "artwork-image", children: [_jsx("label", { children: "Image:" }), _jsx("input", { type: "file", onChange: (e) => setImageFile(e.target.files ? e.target.files[0] : null) }), imageFile && _jsx("img", { src: URL.createObjectURL(imageFile), alt: "Preview", style: { maxWidth: '200px' } })] }), _jsxs("div", { className: "artwork-description", children: [_jsx("label", { children: "Description:" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Enter artwork description" })] }), _jsx("button", { type: "submit", className: "submit-button", children: "Submit Artwork" })] })] }) }));
};
export default Modal;

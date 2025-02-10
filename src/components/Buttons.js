import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router";
import "../css/buttons.css";
export function ButtonLong({ text, onClick, }) {
    return (_jsx("button", { className: "button-long", onClick: onClick, children: text }));
}
export const ButtonCTA = ({ text, link, onClick, }) => {
    return (_jsx(Link, { to: link, children: _jsx("button", { className: "button-cta", onClick: onClick, children: text }) }));
};
export function ButtonPrimary({ text, onClick, className = '', }) {
    return (_jsx("button", { className: `button-primary ${className}`, onClick: onClick, children: text }));
}

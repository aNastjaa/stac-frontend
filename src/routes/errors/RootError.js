import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { isRouteErrorResponse, useRouteError } from "react-router";
const RootError = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (_jsxs(_Fragment, { children: [_jsx("h1", { className: "error-header", children: "Oops!" }), _jsxs("h2", { className: "error-subheader", children: ["Status Code: ", error.status] }), _jsx("p", { className: "error-text", children: error.statusText })] }));
    }
    return _jsx("p", { children: "Oopsie, RootError Element rendered." });
};
export default RootError;

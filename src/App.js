import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { CsrfProvider } from "./context/CsrfContex";
import Router from "./routes/Router";
const App = () => {
    return (_jsx(CsrfProvider, { children: _jsx(AuthProvider, { children: _jsx(RouterProvider, { router: Router }) }) }));
};
export default App;

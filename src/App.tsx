import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { CsrfProvider } from "./context/CsrfContex";
import  Router  from "./routes/Router";

const App = () => {
  return (
    <CsrfProvider>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>
    </CsrfProvider>
  );
};

export default App;

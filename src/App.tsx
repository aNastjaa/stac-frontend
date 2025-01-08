import { RouterProvider } from "react-router";
import { AuthProvider } from "./contex/AuthContex";
import { CsrfProvider } from "./contex/CsrfContex";
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

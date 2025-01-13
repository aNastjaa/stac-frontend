import { isRouteErrorResponse, useRouteError } from "react-router";

const RootError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1 className="error-header">Oops!</h1>
        <h2 className="error-subheader">
          Status Code: {error.status}
        </h2>
        <p className="error-text">{error.statusText}</p>
      </>
    );
  }

  return <p>Oopsie, RootError Element rendered.</p>;
};

export default RootError;

import { isRouteErrorResponse, useRouteError } from "react-router";

const RootError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1 className="text-center text-4xl font-bold">Oops!</h1>
        <h2 className="text-center text-xl font-bold my-4">
          Status Code: {error.status}
        </h2>
        <p className="text-center">{error.statusText}</p>
      </>
    );
  }

  return <p>Oopsie, RootError Element rendered.</p>;
};

export default RootError;

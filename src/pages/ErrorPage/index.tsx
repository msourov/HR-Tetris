import { useRouteError } from "react-router-dom";

interface RouteError {
  statusText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText}</i>
        <br />
        <i>{error.data}</i>
      </p>
    </div>
  );
}

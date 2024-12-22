import "@mantine/core/styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import "react-chat-elements/dist/main.css";

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;

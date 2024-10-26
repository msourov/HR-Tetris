import "@mantine/core/styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { AuthProvider } from "./services/auth/AuthContext";
import "react-chat-elements/dist/main.css";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

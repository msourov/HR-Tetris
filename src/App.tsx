import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

function App() {
  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
  });
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;

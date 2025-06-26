import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import AddPolicy from "./pages/OfficeModule/Policy/AddPolicy/index.tsx";
import CreatePolicy from "./pages/OfficeModule/Policy/AddPolicy/CreatePolicy.tsx";
import UploadPolicyFile from "./pages/OfficeModule/Policy/AddPolicy/UploadFileForm.tsx";
import "./index.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";

const theme = createTheme({
  fontFamily: "Inter, Open Sans, sans-serif",
  primaryColor: "blue",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
        variant: "filled",
      },
      styles: {
        root: {
          minWidth: "90px",
          height: "32px",
          fontWeight: 500,
          fontSize: "12px",
          transition: "all 0.2s ease",
          // Add any other global styles here
        },
      },
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Provider store={store}>
        <ModalsProvider
          modals={{
            demonstration: AddPolicy,
            createPolicy: CreatePolicy,
            uploadPolicy: UploadPolicyFile,
          }}
        >
          <Notifications />
          <App />
        </ModalsProvider>
      </Provider>
    </MantineProvider>
  </React.StrictMode>
);

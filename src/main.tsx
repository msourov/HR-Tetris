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
  fontSizes: {
    xs: "10px",
    sm: "12px",
    md: "13px",
    lg: "14px",
    xl: "16px",
  },
  components: {
    // Global label styling for all form components
    InputWrapper: {
      styles: {
        label: {
          color: "#6B7280 !important", // gray-500
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
    Text: {
      defaultProps: {
        size: "sm",
      },
    },
    Input: {
      defaultProps: {
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
      },
    },
    TextInput: {
      defaultProps: {
        size: "sm",
      },
    },
    Textarea: {
      defaultProps: {
        size: "sm",
      },
    },
    Switch: {
      // No need for label styles here as they're handled by InputWrapper
    },
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

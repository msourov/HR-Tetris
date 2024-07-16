import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./Applayout";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import User from "./pages/AdminModule/User";
import EditUser from "./pages/AdminModule/User/EditUser";
import AddNewUser from "./pages/AdminModule/User/AddNewUser";
import Role from "./pages/AdminModule/Role";
import AddNewRole from "./pages/AdminModule/Role/AddNewRole";
import EditRole from "./pages/AdminModule/Role/EditRole";
import Department from "./pages/OfficeModule/Department";
import AddNewDepartment from "./pages/OfficeModule/Department/AddNewDepartment";
import EditDepartment from "./pages/OfficeModule/Department/EditDepartment";
import Designation from "./pages/OfficeModule/Designation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "role",
        element: <Role />,
        children: [
          {
            path: "role/add-role",
            element: <AddNewRole />,
          },
          {
            path: ":roleId/edit",
            element: <EditRole />,
          },
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          {
            path: "user/add-user",
            element: <AddNewUser />,
          },
          {
            path: ":userId/edit",
            element: <EditUser />,
          },
        ],
      },
      {
        path: "department",
        element: <Department />,
        children: [
          {
            path: "department/add-department",
            element: <AddNewDepartment />,
          },
          {
            path: ":departmentId/edit",
            element: <EditDepartment />,
          },
        ],
      },
      {
        path: "designation",
        element: <Designation />,
        children: [
          {
            path: "department/add-designation",
            element: <AddNewDepartment />,
          },
          {
            path: ":departmentId/edit",
            element: <EditDepartment />,
          },
        ],
      },
    ],
  },
]);

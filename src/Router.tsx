import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./Applayout";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import User from "./pages/AdminModule/User";
import EditUser from "./pages/AdminModule/User/EditUser";
import AddNewUser from "./pages/AdminModule/User/AddNewUser";
import Role from "./pages/AdminModule/Role";
import Department from "./pages/OfficeModule/Department";
import EditDepartment from "./pages/OfficeModule/Department/EditDepartment";
import Designation from "./pages/OfficeModule/Designation";
import Login from "./pages/Login";
import OtpPage from "./pages/Login/OtpPage";
import PublicRoute from "./services/auth/PublicRoute";
import ProtectedRoute from "./services/auth/ProtectedRoutes";
import UserDetail from "./pages/AdminModule/User/UserDetail";
import UserTable from "./pages/AdminModule/User/UserTable";
import AddNewRole from "./pages/AdminModule/Role/AddNewRole";
import RoleTable from "./pages/AdminModule/Role/RoleTable";
import Company from "./pages/OfficeModule/Company";
import CandidateDetail from "./pages/RecruitmentModule/Candidates/CandidateDetail";
import Recruitment from "./pages/RecruitmentModule";
import Candidates from "./pages/RecruitmentModule/Candidates";
import DepartmentDetail from "./pages/OfficeModule/Department/DepartmentDetail";
import DepartmentList from "./pages/OfficeModule/Department/DepartmentList";
import DesignationList from "./pages/OfficeModule/Designation/DesignationList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "role",
            element: <Role />,
            children: [
              {
                index: true,
                element: <RoleTable />,
              },
              {
                path: "add-role",
                element: <AddNewRole />,
              },
            ],
          },
          {
            path: "user",
            element: <User />,
            children: [
              {
                index: true,
                element: <UserTable />,
              },
              {
                path: ":uid/detail",
                element: <UserDetail />,
              },
              {
                path: "add-user",
                element: <AddNewUser />,
              },
              {
                path: ":uid/edit",
                element: <EditUser />,
              },
            ],
          },
          {
            path: "company",
            element: <Company />,
          },
          {
            path: "departments",
            element: <Department />,
            children: [
              {
                index: true,
                element: <DepartmentList />,
              },
              // {
              //   path: "add-department",
              //   element: (
              //     <AddNewDepartment
              //       toggleModal={function (): void {
              //         throw new Error("Function not implemented.");
              //       }}
              //     />
              //   ),
              // },
              {
                path: ":departmentName/detail",
                element: <DepartmentDetail />,
              },
              {
                path: ":departmentId/edit",
                element: <EditDepartment />,
              },
            ],
          },
          {
            path: "designations",
            element: <Designation />,
            children: [
              {
                index: true,
                element: <DesignationList />,
              },

              {
                path: ":designationsId/edit",
                element: <EditDepartment />,
              },
            ],
          },
          {
            path: "candidates",
            element: <Recruitment />,
            children: [
              {
                index: true,
                element: <Candidates />,
              },
              {
                path: ":id/detail",
                element: <CandidateDetail />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "otp",
        element: <OtpPage />,
      },
    ],
  },
]);

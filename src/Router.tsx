import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { Text } from "@mantine/core";
import {
  AddEmployee,
  AddNewRole,
  AddNewUser,
  AnnouncementLayout,
  AnnouncementList,
  AppLayout,
  CandidateDetail,
  Candidates,
  Company,
  Dashboard,
  DepartmentDetail,
  DepartmentLayout,
  DepartmentList,
  DesignationDetail,
  DesignationLayout,
  DesignationList,
  EditAnnnouncement,
  EditDepartment,
  EditDesignation,
  EditShift,
  EditUser,
  EmployeeDetail,
  EmployeeLayout,
  EmplyeeTable,
  ErrorPage,
  HolidayLayout,
  Leave,
  Login,
  ManagePolicy,
  OtpPage,
  Overtime,
  PolicyDetail,
  PolicyLayout,
  PolicyList,
  ProtectedRoute,
  PublicRoute,
  Recruitment,
  Role,
  RoleTable,
  ShiftLayout,
  ShiftList,
  TicketLayout,
  TicketList,
  User,
  UserDetail,
  UserTable,
} from "./lazyComponents";

const loader = (
  <div className="flex justify-center items-center">
    {/* <Loader type="dots" color="red" size="sm" my={30} /> */}
    <Text className="text-center" my={40}>
      Loading...
    </Text>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={loader}>
        <AppLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={loader}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "roles",
            element: (
              <Suspense fallback={loader}>
                <Role />
              </Suspense>
            ),
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
            path: "users",
            element: (
              <Suspense fallback={loader}>
                <User />
              </Suspense>
            ),
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
            element: (
              <Suspense fallback={loader}>
                <Company />
              </Suspense>
            ),
          },
          {
            path: "departments",
            element: (
              <Suspense fallback={loader}>
                <DepartmentLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <DepartmentList />,
              },
              {
                path: "edit",
                element: <EditDepartment />,
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
            ],
          },
          {
            path: "designations",
            element: (
              <Suspense fallback={loader}>
                <DesignationLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <DesignationList />,
              },
              {
                path: "edit",
                element: <EditDesignation />,
              },
              {
                path: ":designationName/detail",
                element: <DesignationDetail />,
              },
            ],
          },
          {
            path: "shift",
            element: (
              <Suspense fallback={loader}>
                <ShiftLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <ShiftList />,
              },
              {
                path: "edit",
                element: <EditShift />,
              },
              // {
              //   path: ":designationName/detail",
              //   element: <DesignationDetail />,
              // },
            ],
          },
          {
            path: "policies",
            element: (
              <Suspense fallback={loader}>
                <PolicyLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <PolicyList />,
              },
              {
                path: "edit",
                element: <ManagePolicy />,
              },
              {
                path: ":policyName/detail",
                element: <PolicyDetail />,
              },
            ],
          },
          {
            path: "holidays",
            element: (
              <Suspense fallback={loader}>
                <HolidayLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <PolicyList />,
              },
              {
                path: "edit",
                element: <ManagePolicy />,
              },
              {
                path: ":policyName/detail",
                element: <PolicyDetail />,
              },
            ],
          },
          {
            path: "employees",
            element: (
              <Suspense fallback={loader}>
                <EmployeeLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <EmplyeeTable />,
              },
              {
                path: "add-employee",
                element: <AddEmployee />,
              },
              {
                path: ":uid/detail",
                element: <EmployeeDetail />,
              },
            ],
          },
          {
            path: "overtime",
            element: (
              <Suspense fallback={loader}>
                <Overtime />
              </Suspense>
            ),
          },
          {
            path: "leave",
            element: (
              <Suspense fallback={loader}>
                <Leave />
              </Suspense>
            ),
          },
          {
            path: "announcement",
            element: (
              <Suspense fallback={loader}>
                <AnnouncementLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <AnnouncementList />,
              },
              {
                path: "edit",
                element: <EditAnnnouncement />,
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
            ],
          },
          {
            path: "ticket",
            element: (
              <Suspense fallback={loader}>
                <TicketLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <TicketList />,
              },
              // {
              //   path: "add-employee",
              //   element: <AddEmployee />,
              // },
              // {
              //   path: ":uid/detail",
              //   element: <EmployeeDetail />,
              // },
            ],
          },
          {
            path: "candidates",
            element: (
              <Suspense fallback={loader}>
                <Recruitment />
              </Suspense>
            ),
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

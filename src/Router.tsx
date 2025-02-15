import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { Loader } from "@mantine/core";
import {
  AddCategory,
  AddCertification,
  AddEmployee,
  AddNewRole,
  AddNewUser,
  AnnouncementLayout,
  AnnouncementList,
  AppLayout,
  AttendanceTable,
  CandidateDetail,
  Candidates,
  CategoryLayout,
  CategoryList,
  CertificationDetail,
  CertificationLayout,
  CertificationTable,
  Company,
  ConsumablesInventory,
  CreateHomeOffice,
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
  EditEmployee,
  EditShift,
  EditUser,
  EmployeeDetail,
  EmployeeLayout,
  EmplyeeTable,
  ErrorPage,
  HolidayLayout,
  HomeOfficeLayout,
  HomeOfficeTable,
  Leave,
  Login,
  ManagePolicy,
  OtpPage,
  Overtime,
  PolicyDetail,
  PolicyLayout,
  PolicyList,
  Recruitment,
  Role,
  RoleTable,
  ShiftLayout,
  ShiftList,
  TangiblesInventory,
  TicketLayout,
  TicketList,
  UpdateCategory,
  User,
  UserDetail,
  UserTable,
} from "./lazyComponents";
import ProtectedRoute from "./services/auth/ProtectedRoutes";
import Settings from "./pages/MyAccountModule/Settings";
import Profile from "./pages/MyAccountModule/Profile";
import PublicRoute from "./services/auth/PublicRoute";
import InventoryLayout from "./pages/InventoryModule";

const loader = (
  <div className="flex justify-center items-center">
    <Loader type="dots" color="blue" size="sm" my={30} />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      // <Suspense fallback={<Loader type="dots" color="red" size="sm" />}>
      <ErrorPage />
      // </Suspense>
    ),
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
            path: "profile",
            element: (
              <Suspense fallback={loader}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={loader}>
                <Settings />
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
                element: <EditUser id="" closeModal={() => {}} />,
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
                path: ":id/detail",
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
                path: ":uid/edit-employee",
                element: <EditEmployee />,
              },
              {
                path: ":uid/detail",
                element: <EmployeeDetail />,
              },
            ],
          },
          {
            path: "attendance",
            element: (
              <Suspense fallback={loader}>
                <EmployeeLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <AttendanceTable />,
              },
              {
                path: "add-employee",
                element: <AddEmployee />,
              },
              {
                path: ":uid/edit-employee",
                element: <EditEmployee />,
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
            path: "certifications",
            element: (
              <Suspense fallback={loader}>
                <CertificationLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <CertificationTable />,
              },
              {
                path: ":id",
                element: (
                  <Suspense fallback={loader}>
                    <CertificationDetail uid="some-uid" closeModal={() => {}} />
                  </Suspense>
                ),
              },
              {
                path: "add-certification",
                element: (
                  <Suspense fallback={loader}>
                    <AddCertification />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "home-office",
            element: (
              <Suspense fallback={loader}>
                <HomeOfficeLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <HomeOfficeTable />,
              },
              {
                path: ":id",
                element: (
                  <Suspense fallback={loader}>
                    {/* <HomeOfficeDetail uid="some-uid" closeModal={() => {}} /> */}
                  </Suspense>
                ),
              },
              {
                path: "create",
                element: (
                  <Suspense fallback={loader}>
                    <CreateHomeOffice />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "category",
            element: (
              <Suspense fallback={loader}>
                <CategoryLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={loader}>
                    <CategoryList />
                  </Suspense>
                ),
              },
              {
                path: "add-category",
                element: (
                  <Suspense fallback={loader}>
                    <AddCategory />
                  </Suspense>
                ),
              },
              {
                path: ":id/edit",
                element: (
                  <Suspense fallback={loader}>
                    <UpdateCategory />
                  </Suspense>
                ),
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
          {
            path: "inventory",
            element: (
              <Suspense fallback={loader}>
                <InventoryLayout />
              </Suspense>
            ),
            children: [
              {
                path: "consumables",
                element: <ConsumablesInventory />,
              },
              {
                path: "tangibles",
                element: <TangiblesInventory />,
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
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

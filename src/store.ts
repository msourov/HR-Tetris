import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/api/userSlice";
import { roleApi } from "./features/api/roleSlice";
import { companyApi } from "./features/api/companySlice";
import { recruitmentApi } from "./features/api/recruitmentSlice";
import { departmentApi } from "./features/api/departmentSlice";
import { designationApi } from "./features/api/designationSlice";
import { shiftApi } from "./features/api/shiftSlice";
import { policyApi } from "./features/api/policySlice";
import { employeeApi } from "./features/api/employeeSlice";
import { overtimeApi } from "./features/api/overtimeSlice";
import { leaveApi } from "./features/api/leaveSlice";
import { ticketApi } from "./features/api/ticketSlice";
import { announcementApi } from "./features/api/announcementSlice";
import { certificationApi } from "./features/api/certificationSlice";
import { attendanceApi } from "./features/api/attendanceSlice";
import { homeOfficeApi } from "./features/api/homeOfficeSlice";
import { tangibleApi } from "./features/api/tangibleInventorySlice";
import { consumableApi } from "./features/api/consumableInventorySlice";
import { categoryApi } from "./features/api/categorySlice";
import { loanApi } from "./features/api/loanSlice";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [designationApi.reducerPath]: designationApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [recruitmentApi.reducerPath]: recruitmentApi.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [policyApi.reducerPath]: policyApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [overtimeApi.reducerPath]: overtimeApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [certificationApi.reducerPath]: certificationApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [homeOfficeApi.reducerPath]: homeOfficeApi.reducer,
    [tangibleApi.reducerPath]: tangibleApi.reducer,
    [consumableApi.reducerPath]: consumableApi.reducer,
    [loanApi.reducerPath]: loanApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      roleApi.middleware,
      departmentApi.middleware,
      designationApi.middleware,
      companyApi.middleware,
      recruitmentApi.middleware,
      shiftApi.middleware,
      policyApi.middleware,
      employeeApi.middleware,
      overtimeApi.middleware,
      leaveApi.middleware,
      ticketApi.middleware,
      announcementApi.middleware,
      certificationApi.middleware,
      attendanceApi.middleware,
      homeOfficeApi.middleware,
      tangibleApi.middleware,
      consumableApi.middleware,
      loanApi.middleware,
      categoryApi.middleware
    ),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

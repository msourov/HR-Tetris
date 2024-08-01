import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/api/userSlice";
import { roleApi } from "./features/api/roleSlice";
import { companyApi } from "./features/api/companySlice";
import { recruitmentApi } from "./features/api/recruitmentSlice";
import { departmentApi } from "./features/api/departmentSlice";
import { designationApi } from "./features/api/designationSlice";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [designationApi.reducerPath]: designationApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [recruitmentApi.reducerPath]: recruitmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      roleApi.middleware,
      departmentApi.middleware,
      designationApi.middleware,
      companyApi.middleware,
      recruitmentApi.middleware
    ),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

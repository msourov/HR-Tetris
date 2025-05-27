// // errorHandling.ts
// import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
// import { getToken } from '../../services/utils/getToken'
// import { useAuth } from '../../services/auth/useAuth'
// import { createApi } from '@reduxjs/toolkit/query/react'
// // import { RootState } from './store'
// // import { logout } from './authSlice' // Create this if needed
// // import { showNotification } from '../utils/notifications' // Your notification system

// const baseQuery = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_APP_BASE_URL,
//   prepareHeaders: (headers, { getState }) => {
//     // Use getToken() directly if 'auth' is not part of RootState
//     const token = getToken()
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`)
//     }
//     return headers
//   },
// })

// export const baseQueryWithErrorHandling = async (
//   args: string | FetchArgs,
//   api: BaseQueryApi,
//   extraOptions: Record<string, unknown> = {}
// ) => {
//   // import { logout } from '../../services/auth/authSlice' // Uncomment and adjust the import path as needed

//     const result = await baseQuery(args, api, extraOptions)

//     if (result.error) {
//       // Handle different error types
//       if ('status' in result.error) {
//         const errorData = result.error.data as { message?: string }
//         const errorMessage = errorData?.message || 'An unexpected error occurred'

//         // Handle 401 Unauthorized
//         if (result.error.status === 401) {
//           // api.dispatch(logout()) // Uncomment if you have a logout action
//           window.location.href = '/login'
//         }

//         // Show error notification
//         showNotification({
//           type: 'error',
//           message: errorMessage,
//         })
//       } else {
//         // Network error
//         showNotification({
//           type: 'error',
//           message: 'Network error. Please check your connection.',
//         })
//       }
//     }

//     return result
// }

// // Update your API services to use the new base query
// export const userApi = createApi({
//   reducerPath: 'userApi',
//   baseQuery: baseQueryWithErrorHandling,
//   // Add tagTypes if needed, e.g. tagTypes: [tagTypes.USER, tagTypes.PROFILE],
//   endpoints: (builder) => ({
//     // Example endpoint, replace or extend as needed
//     getUsers: builder.query<any, void>({
//       query: () => ({
//         url: 'role-user/all',
//         method: 'GET',
//       }),
//     }),
//   }),
// })

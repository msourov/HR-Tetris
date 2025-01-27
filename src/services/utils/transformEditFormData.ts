// import { UnifiedEmployeePayload } from "../../features/types/employee";

// const transformEditFormData = (editFormData: UnifiedEmployeePayload) => {
//   if (!editFormData) return {};

//   // Map permissions
//   const permissions = Object.entries(editFormData.employee_access || {}).map(
//     ([key, value]) => ({
//       label: key
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (char) => char.toUpperCase()), // Human-readable label
//       name: key,
//       checked: value === "a", // Assume 'a' means active/allowed
//       key: key, // Unique identifier
//     })
//   );

//   return {
//     name: editFormData.name || "",
//     phone: editFormData.phone || "",
//     email: editFormData.email || "",
//     password: "", // Reset for security
//     joining_date: editFormData.joining_date || "",
//     employee_id: editFormData.employee_id || "",
//     marital_status: editFormData.marital_status || "Single",
//     bod: editFormData.bod || "",
//     salary: editFormData.salary || 0,
//     department: editFormData.department?.uid || "",
//     designation: editFormData.designation?.uid || "",
//     shift_and_schedule: editFormData.shift_and_schedule?.uid || "",
//     supervisor: editFormData.supervisor || false,
//     executives: Array.isArray(editFormData.executives)
//       ? editFormData.executives[0] || ""
//       : editFormData.executives || "",
//     permissions, // Transformed permissions
//   };
// };

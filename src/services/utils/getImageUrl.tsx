export const getImageUrl = (employeeId: string) => {
  return `${import.meta.env.VITE_APP_EMPLOYEE_FILE}/${employeeId}_image.png`;
};

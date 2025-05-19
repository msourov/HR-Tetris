export const getImageUrl = (employeeId: string) => {
  return `${import.meta.env.VITE_APP_EMPLOYEE_IMAGE}/${employeeId}_image.png`;
};

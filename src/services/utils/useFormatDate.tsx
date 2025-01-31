import dayjs from "dayjs";

const useFormatDate = () => {
  const formatDate = (
    dateString?: string,
    includeTime: boolean = false
  ): string => {
    if (!dateString) return "N/A";
    return includeTime
      ? dayjs(dateString).format("MMM D, YYYY h:mm A")
      : dayjs(dateString).format("MMM D, YYYY");
  };
  return { formatDate };
};

export default useFormatDate;

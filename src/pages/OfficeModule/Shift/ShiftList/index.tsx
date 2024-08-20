import { Box, Loader } from "@mantine/core";
import { useGetShiftsQuery } from "../../../../features/api/shift_schedule";
import ShiftCard from "./ShiftCard";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

const ShiftList = () => {
  const {
    data: shifts,
    isLoading,
    error,
  } = useGetShiftsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    <Loader type="dots" className="self-center" />;
  }
  if (error) {
    <ErrorAlert message="Error fetching shifts" />;
  }

  console.log(shifts?.data);
  return (
    <Box
      mt={20}
      style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}
    >
      {shifts?.data.map((shift) => (
        <ShiftCard key={shift.uid} shift={shift} />
      ))}
    </Box>
  );
};

export default ShiftList;

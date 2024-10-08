import { Box, Loader } from "@mantine/core";
import { useAllOvertimeQuery } from "../../../features/api/overtimeSlice";
import ErrorAlert from "../../../components/shared/ErrorAlert";
// import OvertimeTable from "./OvertimeTable";
import OvertimeList from "./OvertimeList";

const Overtime = () => {
  const { data, isLoading, error } = useAllOvertimeQuery({
    page: 1,
    limit: 10,
  });
  console.log(data);
  if (isLoading) return <Loader size="lg" />;
  if (error) return <ErrorAlert message="Error fetching overtime" />;
  return (
    <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg">
      {/* <OvertimeTable /> */}
      <OvertimeList data={data?.data ?? []} />
    </Box>
  );
};

export default Overtime;

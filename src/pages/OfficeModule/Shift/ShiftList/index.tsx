import { SimpleGrid } from "@mantine/core";
import { useGetShiftsQuery } from "../../../../features/api/shiftSlice";
import ShiftCard from "./ShiftCard";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import AppLoader from "../../../../components/ui/AppLoader";

const ShiftList = () => {
  const { data, isLoading, error } = useGetShiftsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    <AppLoader />;
  }

  if (error) {
    return <ErrorAlert message="Error fetching shifts" />;
  }

  return (
    <div className="my-8">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {data?.data.map((shift) => (
          <ShiftCard key={shift.uid} shift={shift} />
        ))}
      </SimpleGrid>

      {!isLoading && !error && data?.data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No shifts available
        </div>
      )}
    </div>
  );
};

export default ShiftList;

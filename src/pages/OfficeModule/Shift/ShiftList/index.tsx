import { Loader, SimpleGrid, Title, Flex, Divider } from "@mantine/core";
import { useGetShiftsQuery } from "../../../../features/api/shiftSlice";
import ShiftCard from "./ShiftCard";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { IconClock } from "@tabler/icons-react";

const ShiftList = () => {
  const { data, isLoading, error } = useGetShiftsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader type="dots" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message="Error fetching shifts" />;
  }

  return (
    <div className="mb-10">
      <Divider
        label={
          <Flex align="center" gap="sm" className="items-center my-8">
            <IconClock size={24} className="text-blue-600" />
            <Title order={3} className="text-gray-500 font-thin">
              Work Shifts
            </Title>
          </Flex>
        }
        labelPosition="center"
      />

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

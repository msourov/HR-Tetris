import { Box, Loader, Popover, Select, Button, Text } from "@mantine/core";
import ErrorAlert from "../../../components/shared/ErrorAlert";

import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { DateTimePicker } from "@mantine/dates";
import LeaveList from "./LeaveList";
import { useAllLeaveQuery } from "../../../features/api/leaveSlice";

const Leave = () => {
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    is_approved: undefined as "pending" | "approved" | "rejected" | undefined,
    start_time: undefined as string | undefined,
    end_time: undefined as string | undefined,
  });
  const { data, isLoading, error, refetch } = useAllLeaveQuery(searchParams);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  if (error) return <ErrorAlert message="Error fetching leave" />;

  const handleSearch = () => {
    const newParams = {
      ...searchParams,
      is_approved: query as "pending" | "approved" | "rejected" | undefined,
      start_time: startDate?.toISOString(),
      end_time: endDate?.toISOString(),
    };
    setSearchParams(newParams);
    refetch();
    setOpened(false);
  };

  return (
    <Box className="w-[85%] mx-auto rounded-lg px-4">
      <Box className="flex justify-end mt-10 mb-2 mr-4">
        <Popover
          opened={opened}
          onChange={setOpened}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button
              leftSection={<IoFilter />}
              size="compact-sm"
              color="white"
              bg="black"
              c="white"
              variant="outline"
              mt={-24}
              mb={16}
              onClick={() => setOpened((o) => !o)}
            >
              Filter
            </Button>
          </Popover.Target>
          <Popover.Dropdown bg="var(--mantine-color-body)">
            <DateTimePicker
              variant="filled"
              valueFormat="DD MMM YYYY hh:mm A"
              placeholder="Pick Start Date"
              popoverProps={{ withinPortal: false }}
              value={startDate}
              onChange={setStartDate}
              className="mb-2"
            />
            <DateTimePicker
              variant="filled"
              valueFormat="DD MMM YYYY hh:mm A"
              placeholder="Pick End Date"
              popoverProps={{ withinPortal: false }}
              value={endDate}
              onChange={setEndDate}
              className="mb-2"
            />
            <Select
              variant="filled"
              placeholder="Select Status"
              comboboxProps={{ withinPortal: false }}
              data={["pending", "approved", "rejected"]}
              value={query}
              onChange={(value) => setQuery(value)}
            />
            <Box className="flex justify-end gap-2 mt-4">
              <Button
                variant="default"
                size="compact-sm"
                onClick={handleSearch}
              >
                Apply
              </Button>
              <Button
                variant="default"
                size="compact-sm"
                onClick={() => {
                  setQuery(null);
                  setStartDate(null);
                  setEndDate(null);
                  setSearchParams({
                    ...searchParams,
                    is_approved: undefined,
                    start_time: undefined,
                    end_time: undefined,
                  });
                }}
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="compact-sm"
                c="red"
                onClick={() => setOpened(false)}
              >
                Close
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      </Box>
      <Box>
        {data && Array.isArray(data?.data) && data?.data.length > 0 ? (
          <LeaveList data={data?.data ?? []} />
        ) : (
          <Text ta="center">No data found</Text>
        )}
      </Box>
    </Box>
  );
};

export default Leave;

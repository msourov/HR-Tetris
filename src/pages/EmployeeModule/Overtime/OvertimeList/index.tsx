import { Box, Button, ScrollArea, Select } from "@mantine/core";
import CustomCard from "./CustomCard";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import OvertimeLeaveSkeleton from "../../../../components/shared/Skeletons/OvertimeLeaveSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useGetAllOvertimeQuery } from "../../../../features/api/overtimeSlice";
import NoDataMessage from "../../../../components/ui/NoDataMessage";

const OvertimeList = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    is_approved: undefined as "pending" | "approved" | "rejected" | undefined,
    start_time: undefined as string | undefined,
    end_time: undefined as string | undefined,
  });

  const { data, isLoading, error, refetch, isFetching } =
    useGetAllOvertimeQuery(searchParams);

  const handleSearch = () => {
    const newParams = {
      ...searchParams,
      is_approved: query as "pending" | "approved" | "rejected" | undefined,
      start_time: startDate?.toISOString(),
      end_time: endDate?.toISOString(),
    };
    setSearchParams(newParams);
    refetch();
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex flex-col gap-4 my-8 mx-12">
        {Array.from({ length: 5 }).map((_, index) => (
          <OvertimeLeaveSkeleton key={index} />
        ))}
      </div>
    );

  if (error) return <ErrorAlert message="Error fetching leave" />;

  return (
    <>
      <div className="flex items-start gap-4">
        <div className="flex gap-2">
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            placeholder="Pick Start Date"
            popoverProps={{ withinPortal: false }}
            value={startDate}
            onChange={setStartDate}
          />
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            placeholder="Pick End Date"
            popoverProps={{ withinPortal: false }}
            value={endDate}
            onChange={setEndDate}
          />
          <Select
            placeholder="Select Status"
            comboboxProps={{ withinPortal: false }}
            data={["pending", "approved", "rejected"]}
            value={query}
            onChange={(value) => setQuery(value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="filled"
            color="blue"
            size="compact-sm"
            onClick={handleSearch}
            className="border border-white/20"
            disabled={!query && !startDate && !endDate}
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
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100, scrollBehavior: "smooth" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 h-[70vh] sm:h-[75vh] md:h-[78vh] lg:h-[82vh] xl:h-[85vh]"
      >
        <ScrollArea
          offsetScrollbars
          className="relative h-full"
          styles={{
            viewport: {
              height: "100%",
            },
            scrollbar: {
              backgroundColor: "#e5e7eb",
            },
            thumb: {
              backgroundColor: "#4b5563",
              borderRadius: "4px",
            },
          }}
        >
          <Box className="mb-10 gap-4 flex flex-col">
            {data && Array.isArray(data?.data) && data?.data.length > 0 ? (
              data?.data.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -100 * index }}
                  whileInView={{ opacity: 1, x: 0 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  viewport={{ once: true }}
                >
                  <CustomCard key={item.id} {...item} />
                </motion.div>
              ))
            ) : (
              <NoDataMessage
                message="overtime"
                onRefresh={refetch}
                loading={isFetching}
              />
            )}
          </Box>
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 z-10 bg-gradient-to-t from-white to-transparent" />
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default OvertimeList;

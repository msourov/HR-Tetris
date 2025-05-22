import { useState } from "react";
import { Flex, Pagination, Text, Alert, Box, Card } from "@mantine/core";
import { useGetTasksQuery } from "../../../../features/api/taskSlice";
import TaskCard from "./TaskCard";
import { IconAlertCircle } from "@tabler/icons-react";
import AppLoader from "../../../../components/ui/AppLoader";
import { splitByPriority } from "../../../../services/utils/splitByPriority";

const TaskList = () => {
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data, isLoading, error } = useGetTasksQuery({ page, limit });

  const { highPriority, mediumPriority, lowPriority } = splitByPriority(
    data?.data ?? []
  );

  return (
    <div className="mx-8  h-full">
      {isLoading ? (
        <Flex justify="center" align="center" h="60vh">
          <AppLoader size="sm" />
        </Flex>
      ) : error ? (
        <Alert
          variant="light"
          color="red"
          title="Error loading tasks"
          icon={<IconAlertCircle />}
        >
          Failed to load tasks. Please try again later.
        </Alert>
      ) : (
        <>
          {/* Displays tasks in three columns based on priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            {/* Low Priority Column */}
            <Card
              withBorder
              radius="md"
              className="flex flex-col flex-1 min-w-[300px] shadow-sm h-[calc(100vh-300px)]"
            >
              <Card.Section className="bg-green-100 p-2">
                <Text
                  size="sm"
                  className="text-center font-semibold text-green-800"
                >
                  Low Priority
                </Text>
              </Card.Section>
              <div className="space-y-4 p-4 overflow-y-auto flex-1">
                {lowPriority?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </Card>

            {/* Medium Priority Column */}
            <Card
              withBorder
              radius="md"
              className="flex-1 min-w-[300px] shadow-sm"
            >
              <Card.Section className="bg-yellow-100 p-2">
                <Text
                  size="sm"
                  className="text-center font-semibold text-yellow-800"
                >
                  Medium Priority
                </Text>
              </Card.Section>
              <div className="space-y-4 p-4 overflow-y-auto">
                {mediumPriority?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </Card>

            {/* High Priority Column */}
            <Card
              withBorder
              radius="md"
              className="flex-1 min-w-[300px] shadow-sm"
            >
              <Card.Section className="bg-red-100 p-2">
                <Text
                  size="sm"
                  className="text-center font-semibold text-red-800"
                >
                  High Priority
                </Text>
              </Card.Section>
              <div className="space-y-4 p-4 overflow-y-auto">
                {highPriority?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </Card>
          </div>

          {data?.data?.length === 0 && (
            <Box ta="center" py="xl">
              <Text size="xl" c="dimmed" fw={500}>
                No tasks found
              </Text>
            </Box>
          )}

          {data?.pagination?.total_pages && data.pagination.total_pages > 1 && (
            <Box mt="xl" py="md">
              <Flex justify="center">
                <Pagination
                  value={page}
                  total={data.pagination?.total_pages ?? 1}
                  siblings={2}
                  boundaries={2}
                  color="blue"
                  radius="md"
                  withEdges
                  withControls
                  onChange={setPage}
                  styles={{
                    control: {
                      fontSize: "var(--mantine-font-size-sm)",
                      padding: "0.5rem 1rem",
                    },
                  }}
                />
              </Flex>
            </Box>
          )}
        </>
      )}
    </div>
  );
};
export default TaskList;

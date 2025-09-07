import { Text, Card } from "@mantine/core";
import TaskCard from "./TaskCard";
import { splitByPriority } from "../../../../services/utils/splitByPriority";
import { TaskResponse } from "../../../../features/types/task";

const TaskCards = ({ tasks }: { tasks: TaskResponse[] }) => {
  const { highPriority, mediumPriority, lowPriority } = splitByPriority(tasks);

  return (
    <div className="my-6">
      {/* Displays tasks in three columns based on priority */}
      <p className="text-center mb-6 font-semibold text-gray-500">
        Tasks are grouped by priority
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
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
              Low
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
          className="flex-1 min-w-[300px] shadow-sm h-[calc(100vh-300px)]"
        >
          <Card.Section className="bg-yellow-100 p-2">
            <Text
              size="sm"
              className="text-center font-semibold text-yellow-800"
            >
              Medium
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
          className="flex-1 min-w-[300px] shadow-sm h-[calc(100vh-300px)]"
        >
          <Card.Section className="bg-red-100 p-2">
            <Text size="sm" className="text-center font-semibold text-red-800">
              High
            </Text>
          </Card.Section>
          <div className="space-y-4 p-4 overflow-y-auto">
            {highPriority?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </Card>
      </div>

      {/* {data?.pagination?.total_pages && data.pagination.total_pages > 1 && (
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
        )} */}
    </div>
  );
};
export default TaskCards;

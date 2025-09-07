import AppPageHeader from "../../../components/core/AppPageHeader";
import {
  IconAlertCircle,
  IconLayoutCards,
  IconList,
} from "@tabler/icons-react";
import { lazy, Suspense, useState } from "react";
import { useGetTasksQuery } from "../../../features/api/taskSlice";
import TaskTable from "./TaskTable";
import { Alert, Button, Flex, SegmentedControl } from "@mantine/core";
import AppLoader from "../../../components/ui/AppLoader";
import { useTaskDrawer } from "../../../features/task/context/useTaskDrawer";
import AddTask from "./AddTask";
import { LuPlus } from "react-icons/lu";

export const TaskLayout = () => {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const { opened, open, setTaskId, close } = useTaskDrawer();

  const [page, setPage] = useState(1);
  const limit = viewMode === "cards" ? 50 : 10;

  const { data, isLoading, error } = useGetTasksQuery({ page, limit });

  const handleAddTask = () => {
    setTaskId("");
    open();
  };

  const TaskCards = lazy(() => import("./TaskCards"));

  return (
    <div className="w-[95%] lg:w-[90%] min-h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Task"
          Breadcrumb={{ module: "Task Management", page: "List" }}
          ShowAddButton={false}
        />
        <Button
          leftSection={<LuPlus size={18} />}
          onClick={handleAddTask}
          color="blue"
          className="my-10"
        >
          Add Task
        </Button>
      </div>

      <div className="flex justify-between items-center">
        {/* Segmented Control for Table / Card view */}
        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as "table" | "cards")}
          data={[
            {
              value: "table",
              label: (
                <div className="flex items-center gap-2">
                  <IconList size={16} />
                  <span>Table</span>
                </div>
              ),
            },
            {
              value: "cards",
              label: (
                <div className="flex items-center gap-2">
                  <IconLayoutCards size={16} />
                  <span>Card</span>
                </div>
              ),
            },
          ]}
          radius="md"
          color="orange"
        />

        {/* Drawer modal */}
        <AddTask opened={opened} onClose={close} />
      </div>

      {isLoading || error ? (
        isLoading ? (
          <Flex justify="center" align="center" h="60vh">
            <AppLoader size="sm" />
          </Flex>
        ) : (
          <Alert
            variant="light"
            color="red"
            title="Error loading tasks"
            icon={<IconAlertCircle />}
          >
            Failed to load tasks. Please try again later.
          </Alert>
        )
      ) : viewMode === "table" ? (
        <TaskTable
          tasks={data?.data || []}
          page={page}
          totalPages={data?.pagination?.total_pages || 1}
          limit={limit}
          setPage={setPage}
        />
      ) : (
        <Suspense
          fallback={
            <Flex justify="center" align="center" h="60vh">
              <AppLoader size="sm" />
            </Flex>
          }
        >
          <TaskCards tasks={data?.data || []} />
        </Suspense>
      )}
    </div>
  );
};

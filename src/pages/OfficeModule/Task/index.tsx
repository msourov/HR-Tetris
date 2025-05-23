import AppPageHeader from "../../../components/core/AppPageHeader";
import {
  IconAlertCircle,
  IconLayoutCards,
  IconList,
} from "@tabler/icons-react";
import { lazy, Suspense, useState } from "react";
import { useGetTasksQuery } from "../../../features/api/taskSlice";
import TaskTable from "./TaskTable";
import { Alert, Button, Flex } from "@mantine/core";
import AppLoader from "../../../components/ui/AppLoader";
import TaskFormDrawer from "./AddTask";

const TaskLayout = () => {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [page, setPage] = useState(1);
  const limit = viewMode === "cards" ? 50 : 10;

  const { data, isLoading, error } = useGetTasksQuery({ page, limit });

  const TaskCards = lazy(() => import("./TaskCards"));

  return (
    <div className="">
      <AppPageHeader
        Heading="Task"
        Breadcrumb={{ module: "Task Management", page: "List" }}
        ShowAddButton={false}
      />
      <div className="mb-8 mx-auto max-h-fit rounded-lg drop-shadow-lg flex-1 w-[90vw] md:w-[80vw] lg:w-[70vw]">
        <div className="mb-10 space-x-4 flex justify-between">
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={() => setViewMode("table")}
              leftSection={<IconList />}
              className={`px-2 flex items-center gap-2 ${
                viewMode === "table" ? "bg-blue-600 text-white" : ""
              } border rounded-lg`}
            >
              Table
            </Button>
            <Button
              variant="default"
              onClick={() => setViewMode("cards")}
              leftSection={<IconLayoutCards />}
              className={`px-2 py-1 ${
                viewMode === "cards" ? "bg-blue-600 text-white" : ""
              } border rounded-lg`}
            >
              Card
            </Button>
          </div>
          <TaskFormDrawer />
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
        ) : (
          <>
            {viewMode === "table" ? (
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
          </>
        )}
      </div>
    </div>
  );
};

export default TaskLayout;

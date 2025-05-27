import { TaskDrawerProvider } from "../../../features/task/context/TaskDrawerContext";
import { TaskLayout } from "./TaskLayout";

const Task = () => {
  return (
    <TaskDrawerProvider>
      <TaskLayout />
    </TaskDrawerProvider>
  );
};

export default Task;

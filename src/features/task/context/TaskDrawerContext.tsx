// context/TaskDrawerContext.tsx
import { createContext, useState } from "react";

interface TaskDrawerContextType {
  opened: boolean;
  open: () => void;
  close: () => void;
  taskId: string | null;
  setTaskId: (id: string | null) => void;
}

export const TaskDrawerContext = createContext<TaskDrawerContextType | null>(
  null
);

export const TaskDrawerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [opened, setOpened] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  const open = () => setOpened(true);
  const close = () => {
    setOpened(false);
    setTaskId(null); // Optional: reset on close
  };

  return (
    <TaskDrawerContext.Provider
      value={{ opened, open, close, taskId, setTaskId }}
    >
      {children}
    </TaskDrawerContext.Provider>
  );
};

import { useContext } from "react";
import { TaskDrawerContext } from "./TaskDrawerContext";

export const useTaskDrawer = () => {
  const context = useContext(TaskDrawerContext);
  if (!context) {
    throw new Error("useTaskDrawer must be used within a TaskDrawerProvider");
  }
  return context;
};

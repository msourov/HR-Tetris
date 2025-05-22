import { TaskResponse } from "../../features/types/task";

export function splitByPriority(data: TaskResponse[]) {
  const highPriority: TaskResponse[] = [];
  const mediumPriority: TaskResponse[] = [];
  const lowPriority: TaskResponse[] = [];

  data.forEach((task) => {
    if (task.priority === "high") {
      highPriority.push(task);
    } else if (task.priority === "medium") {
      mediumPriority.push(task);
    } else if (task.priority === "low") {
      lowPriority.push(task);
    }
  });

  return { highPriority, mediumPriority, lowPriority };
}

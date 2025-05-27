import React from "react";
import { ActionIcon, Group, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDeleteTaskMutation } from "../../../../features/api/taskSlice";
import { useTaskDrawer } from "../../../../features/task/context/useTaskDrawer";
import { TaskDetails } from "./TaskDetail";

interface TaskActionsProps {
  taskId: string;
  taskTitle: string;
  disabled?: boolean;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  taskId,
  taskTitle,
  disabled,
}) => {
  const { open, setTaskId } = useTaskDrawer();
  const [openedView, { open: openView, close: closeView }] =
    useDisclosure(false);

  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleTaskEditOpen = () => {
    setTaskId(taskId);
    open();
  };

  const handleTaskViewOpen = () => {
    setTaskId(taskId);
    openView();
  };

  const handleDelete = async () => {
    try {
      await deleteTask({ uid: taskId }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Task deleted successfully",
        color: "green",
        autoClose: 3000,
      });
      closeDelete();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete task",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Group gap={4} justify="right">
        <ActionIcon
          color="blue"
          variant="subtle"
          onClick={handleTaskViewOpen}
          disabled={disabled}
        >
          <IconEye size="1.45rem" />
        </ActionIcon>

        <ActionIcon
          color="blue"
          variant="subtle"
          onClick={handleTaskEditOpen}
          disabled={disabled}
        >
          <IconPencil size="1.25rem" />
        </ActionIcon>

        <ActionIcon
          color="red"
          variant="subtle"
          onClick={openDelete}
          disabled={disabled || isDeleting}
        >
          <IconTrash size="1.25rem" />
        </ActionIcon>
      </Group>

      {/* Edit Task Modal */}
      {/* <Modal 
        opened={editOpened} 
        onClose={closeEdit}
        title="Edit Task"
        size="md"
      >
        {isDetailLoading ? (
          <div className="flex justify-center p-4">
            <Loader type="dots" />
          </div>
        ) : (
          <EditTask
            taskId={taskId}
            initialTitle={taskTitle}
            initialDescription={taskDetail?.description || ''}
            closeModal={closeEdit}
          />
        )}
      </Modal> */}

      {/* Open Details Modal */}
      <Modal opened={openedView} onClose={closeView} centered size="lg">
        <TaskDetails uid={taskId} closeModal={closeView} />
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirm Delete"
        centered
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete "{taskTitle}"?</p>
          <Group justify="end">
            <Button variant="default" onClick={closeDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={isDeleting}>
              Delete
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default TaskActions;

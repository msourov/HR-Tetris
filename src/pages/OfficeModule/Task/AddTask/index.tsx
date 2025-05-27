import TaskFormDrawer from "./TaskFormDrawer";

const AddTask = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  return <TaskFormDrawer opened={opened} onClose={onClose} />;
};

export default AddTask;

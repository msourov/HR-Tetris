import { Card, Pagination, Select, Table, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { TaskResponse } from "../../../../features/types/task";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";

const TaskTable = ({
  tasks,
  page,
  totalPages,
  limit,
  setPage,
}: {
  tasks: TaskResponse[];
  page: number;
  totalPages: number;
  limit: number;
  setPage: (page: number) => void;
  // onPaginate: () => void;
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  return (
    <Card withBorder radius="md" className="p-4">
      <div className="flex gap-4 mt-2 mb-6">
        <Select
          placeholder="Filter by priority"
          data={["All", "High", "Medium", "Low"]}
          value={selectedPriority}
          onChange={setSelectedPriority}
          className="w-48"
        />
        <TextInput
          placeholder="Search tasks..."
          leftSection={<IconSearch size={16} />}
        />
      </div>

      <Table striped highlightOnHover>
        <TableHeading />
        <Table.Tbody>
          {tasks.map((item, index) => (
            <TableItem
              key={item.uid}
              item={item}
              index={(page - 1) * limit + index}
            />
          ))}
        </Table.Tbody>
      </Table>
      <div className="ml-auto mt-4">
        <Pagination
          color="blue"
          total={totalPages}
          value={page}
          onChange={setPage}
          className="mt-4 justify-center"
        />
      </div>
    </Card>
  );
};

export default TaskTable;

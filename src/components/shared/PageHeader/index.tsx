import { Box, Button, Text, Group } from "@mantine/core";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import { FaHome } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = {
  Operation?: string;
  Heading?: string;
  Breadcrumb?: {
    module: string;
    page: string;
  };
};

const PageHeader: React.FC<PageHeaderProps> = ({
  Operation = "Add",
  Heading,
  Breadcrumb,
}) => {
  const navigate = useNavigate();
  const route = Heading?.toLowerCase();

  return (
    <Box
      w={"100%"}
      px={"2.25rem"}
      className="flex justify-between items-center mb-6 py-4"
    >
      <div className="space-y-4">
        {Breadcrumb && (
          <Group gap={4} align="center" className="drop-shadow-lg">
            <FaHome size={16} color="#7c93b7" />
            <IconChevronRight size={16} color="gray" />
            <Text span size="md" color="dimmed">
              {Breadcrumb.module}
            </Text>
            <IconChevronRight size={16} color="gray" />
            <Text span size="md" color="dimmed">
              {Breadcrumb.page}
            </Text>
          </Group>
        )}
        <Button
          variant="outline"
          color="black"
          size="compact-sm"
          leftSection={<IoMdReturnLeft size={16} color="gray" />}
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:bg-gray-200 border-gray-400"
        >
          Back
        </Button>
      </div>

      <Button
        variant="filled"
        color="white"
        c="blue"
        size="sm"
        className="shadow-md text-sm hover:bg-blue-100 hover:text-white border-blue-300"
        leftSection={Operation === "Add" && <IconPlus size={16} />}
        onClick={() =>
          navigate(`${Heading !== "Home Office" ? `add-${route}` : "create"}`)
        }
      >{`${Operation} ${Heading}`}</Button>
    </Box>
  );
};

export default PageHeader;

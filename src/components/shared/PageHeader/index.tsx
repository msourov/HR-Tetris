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
  ShowAddButton?: boolean;
  showBackButton?: boolean;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  Operation = "Add",
  Heading,
  Breadcrumb,
  ShowAddButton,
  showBackButton,
}) => {
  const navigate = useNavigate();
  const route = Heading?.toLowerCase();

  return (
    <Box
      // w={"100%"}
      // px={"5%"}
      className="flex justify-between items-center my-8"
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

        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-1 border border-white/20 hover:bg-gray-200 rounded py-[4px] w-[65px] my-6"
          >
            <IoMdReturnLeft size={16} color="gray" />
            Back
          </button>
        )}
      </div>
      {ShowAddButton && (
        <Button
          variant="filled"
          color="blue"
          size="sm"
          className="shadow-md text-sm hover:shadow-lg border-blue-300"
          leftSection={Operation === "Add" && <IconPlus size={16} />}
          onClick={() =>
            navigate(`${Heading !== "Home Office" ? `add-${route}` : "create"}`)
          }
        >{`${Operation} ${Heading}`}</Button>
      )}
    </Box>
  );
};

export default PageHeader;

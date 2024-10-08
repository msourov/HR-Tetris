import { Box, Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = {
  Heading?: string;
  Breadcrumb?: {
    module: string;
    page: string;
  };
};

const PageHeader: React.FC<PageHeaderProps> = ({ Heading, Breadcrumb }) => {
  const navigate = useNavigate();
  const route = Heading?.toLocaleLowerCase();
  return (
    <Box
      w={"100%"}
      px={"2.75rem"}
      py={"1rem"}
      className="flex justify-between"
      style={{
        background: "linear-gradient(to right, #e0f7ff, #c3e8f9)",
      }}
    >
      <div>
        <Text component="h1" size="xl" className="drop-shadow-2xl font-bold">
          {Heading}
        </Text>
        {Breadcrumb && (
          <Text component="p" size="md" className="drop-shadow-2xl">
            {Breadcrumb.module} <span className="font-extrabold"> . </span>{" "}
            {Breadcrumb.page}
          </Text>
        )}
      </div>

      <Button
        leftSection={<IconPlus />}
        style={{
          backgroundColor: "#2b266e",
          marginBlock: "auto",
          paddingInline: "0.65rem",
          borderRadius: "10px",
        }}
        bg="orange"
        onClick={() => navigate(`add-${route}`)}
      >{`Add ${Heading}`}</Button>
    </Box>
  );
};

export default PageHeader;

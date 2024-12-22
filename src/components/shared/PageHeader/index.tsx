import { Box, Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
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
  const route = Heading?.toLocaleLowerCase();
  return (
    <Box
      w={"100%"}
      px={"2.75rem"}
      py={"1rem"}
      className="flex justify-between"
      style={{
        background: "#7c93b7",
        color: "white",
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
        leftSection={Operation === "Add" && <IconPlus />}
        style={{
          backgroundColor: "#ee6c4d",
          marginBlock: "auto",
          paddingInline: "0.65rem",
          borderRadius: "10px",
        }}
        bg="#EF6F6C"
        onClick={() => navigate(`add-${route}`)}
      >{`${Operation} ${Heading}`}</Button>
    </Box>
  );
};

export default PageHeader;

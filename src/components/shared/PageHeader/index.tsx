import { Box, Text } from "@mantine/core";

type PageHeaderProps = {
  Heading?: string;
  Breadcrumb?: {
    module: string;
    page: string;
  };
};

const PageHeader: React.FC<PageHeaderProps> = ({ Heading, Breadcrumb }) => {
  return (
    <Box w={"100%"} bg={"#ddeaf5"} px={"2.75rem"} py={"1rem"}>
      <Text component="h1" size="xl" className="drop-shadow-2xl font-bold">
        {Heading}
      </Text>
      {Breadcrumb && (
        <Text component="p" size="md" className="drop-shadow-2xl">
          {Breadcrumb.module} <span className="font-extrabold"> . </span>{" "}
          {Breadcrumb.page}
        </Text>
      )}
    </Box>
  );
};

export default PageHeader;

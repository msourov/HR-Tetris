import { Box, Card, Loader, Pill, SimpleGrid, Text } from "@mantine/core";
import { useGetDesignationsQuery } from "../../../../features/api/designationSlice";

const DesignationList = () => {
  const {
    data: designationData,
    isLoading,
    error,
  } = useGetDesignationsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <p>Something went wrong.</p>;
  }

  return (
    <Box className="mt-6">
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {designationData?.data?.map((item) => (
          <Card
            shadow="sm"
            // padding="xl"
            component="a"
            withBorder
            maw={250}
            className="text-center flex-auto p-4 max-w-full overflow-hidden py-6 gap-2"
          >
            <Text fw={500} size="lg" className="truncate">
              {item?.name}
            </Text>
            <Text component="span">
              <Pill
                size="sm"
                c="dimmed"
                className={item?.active ? "bg-green-200" : "bg-gray-200"}
              >
                {`${item?.active ? "Active" : "Inactive"}`}
              </Pill>
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DesignationList;

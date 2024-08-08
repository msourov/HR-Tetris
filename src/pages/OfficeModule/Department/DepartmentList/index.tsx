import { Box, Card, Loader, Pill, SimpleGrid, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../../../features/api/departmentSlice";

const DepartmentList = () => {
  const {
    data: departmentData,
    isLoading,
    error,
  } = useGetDepartmentsQuery({ page: 1, limit: 10 });
  //   console.log("departmentData", departmentData);
  const navigate = useNavigate();

  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <p>Something went wrong.</p>;
  }

  return (
    <Box className="mt-6">
      <SimpleGrid
        cols={{ sm: 3, md: 5, xl: 6 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {departmentData?.data?.map((item) => (
          <Card
            shadow="sm"
            // padding="xl"
            component="a"
            withBorder
            maw={250}
            className="text-center flex-auto max-w-full overflow-hidden py-6 gap-2 cursor-pointer"
            onClick={() => navigate(`${item?.name}/detail`)}
          >
            <Text fw={500} size="md" className="truncate">
              {item?.name}
            </Text>
            {/* <Card.Section className="flex py-4 px-2 justify-end"> */}
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

export default DepartmentList;
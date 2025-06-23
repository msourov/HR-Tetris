import { Box, Pill, SimpleGrid, Text } from "@mantine/core";
import { useGetDesignationsQuery } from "../../../../features/api/designationSlice";
import { useNavigate } from "react-router-dom";
import AppLoader from "../../../../components/ui/AppLoader";
import CardGlass from "../../../../components/ui/CardGlass";

const DesignationList = () => {
  const navigate = useNavigate();
  const {
    data: designationData,
    isLoading,
    error,
  } = useGetDesignationsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    <AppLoader />;
  }
  if (error) {
    <p>Something went wrong.</p>;
  }
  return (
    <Box className="mt-6">
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 4, xl: 5 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {designationData?.data?.map((item) => (
          <CardGlass
            key={item?.uid}
            className="w-full hover:cursor-pointer"
            onClick={() => navigate(`${item?.uid}/detail`)}
          >
            <Text fw={500} size="md" className="truncate">
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
          </CardGlass>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DesignationList;

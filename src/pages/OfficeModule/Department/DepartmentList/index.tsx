import { Pill, SimpleGrid } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../../../features/api/departmentSlice";
import AppLoader from "../../../../components/ui/AppLoader";
import CardGlass from "../../../../components/ui/CardGlass";

const DepartmentList = () => {
  const {
    data: departmentData,
    isLoading,
    error,
  } = useGetDepartmentsQuery({ page: 1, limit: 10 });
  const navigate = useNavigate();

  if (isLoading) {
    <AppLoader />;
  }

  console.log(error, "error");

  return (
    <div className="mt-6">
      <SimpleGrid
        cols={{ sm: 3, md: 5, xl: 6 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {departmentData?.data?.map((item) => (
          <CardGlass
            key={item?.uid}
            // component="a"
            // maw={250}
            className="text-center flex-auto max-w-full overflow-hidden py-6 gap-2 cursor-pointer"
            onClick={() => navigate(`${item?.uid}/detail`)}
          >
            <p className="font-medium text-md truncate">{item?.name}</p>
            {/* <Card.Section className="flex py-4 px-2 justify-end"> */}
            <span>
              <Pill
                size="sm"
                c="dimmed"
                className={item?.active ? "bg-green-200" : "bg-gray-200"}
              >
                {`${item?.active ? "Active" : "Inactive"}`}
              </Pill>
            </span>
          </CardGlass>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default DepartmentList;

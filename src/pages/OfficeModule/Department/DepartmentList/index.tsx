import { Card, Loader, Pill, SimpleGrid } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../../../features/api/departmentSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";

const DepartmentList = () => {
  const {
    data: departmentData,
    isLoading,
    error,
  } = useGetDepartmentsQuery({ page: 1, limit: 10 });
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    <Loader type="dots" />;
  }

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <div className="mt-6">
      <SimpleGrid
        cols={{ sm: 3, md: 5, xl: 6 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {departmentData?.data?.map((item) => (
          <Card
            component="a"
            withBorder
            maw={250}
            className="text-center flex-auto max-w-full overflow-hidden py-6 gap-2 cursor-pointer"
            onClick={() => navigate(`${item?.name}/detail`)}
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
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default DepartmentList;

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useGetAllCategoriesQuery } from "../../../../features/api/categorySlice";
import { useAuth } from "../../../../services/auth/useAuth";
import { Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import AddCategoryRow from "../AddCategory/AddCategoryRow";

const CategoryList = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({
    page: 1,
    limit: 10,
  });
  const { logout } = useAuth();

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }
  console.log(data);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddCategoryRow />
      </div>
      <Table>
        <TableHeading />
        <TableItem data={data || []} isLoading={isLoading} error={error} />
      </Table>
    </>
  );
};

export default CategoryList;

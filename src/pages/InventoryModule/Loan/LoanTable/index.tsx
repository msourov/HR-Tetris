import { Pagination, Table } from "@mantine/core";
import { useGetAllLoansQuery } from "../../../../features/api/loanSlice";
import LoanTableHeading from "./LoanHeading";
import LoanTableItems from "./LoanItems";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";
import { useState } from "react";

const LoanTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetAllLoansQuery({
    page,
    limit,
  });

  return (
    <>
      <Table striped highlightOnHover>
        <LoanTableHeading />
        <LoanTableItems
          data={(data?.data as LoanWithGuarantorObj[]) || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination
          value={data?.pagination.page ?? 1}
          total={data?.pagination.total_pages ?? 1}
          siblings={1}
          boundaries={1}
          color="blue"
          onChange={setPage}
        />
      </div>
    </>
  );
};

export default LoanTable;

import { Table } from "@mantine/core";
import { useGetAllLoansQuery } from "../../../../features/api/loanSlice";
import LoanTableHeading from "./LoanHeading";
import LoanTableItems from "./LoanItems";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";

const LoanTable = () => {
  const { data, isLoading, error } = useGetAllLoansQuery({
    page: 1,
    limit: 10,
  });

  return (
    <Table striped highlightOnHover>
      <LoanTableHeading />
      <LoanTableItems
        data={(data?.data as LoanWithGuarantorObj[]) || []}
        isLoading={isLoading}
        error={error}
      />
    </Table>
  );
};

export default LoanTable;

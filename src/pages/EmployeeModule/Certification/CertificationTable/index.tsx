import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetCertificationsQuery } from "../../../../features/api/certificationSlice";

const CertificationTable = () => {
  const {
    data: certifications,
    isLoading,
    error,
  } = useGetCertificationsQuery({
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <Table>
        <TableHeading />
        <TableItem
          data={certifications?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination total={4} color="rgb(33, 41, 34)" />
      </div>
    </div>
  );
};

export default CertificationTable;

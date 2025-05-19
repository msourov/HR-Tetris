import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetCertificationsQuery } from "../../../../features/api/certificationSlice";
import { useState } from "react";

const CertificationTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: certifications,
    isLoading,
    error,
  } = useGetCertificationsQuery({
    page,
    limit,
  });

  return (
    <>
      <Table>
        <TableHeading />
        <TableItem
          page={certifications?.pagination?.page ?? 1}
          limit={certifications?.pagination?.page_size ?? 10}
          data={certifications?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination
          value={certifications?.pagination.page ?? 1}
          total={certifications?.pagination.total_pages ?? 1}
          siblings={1}
          boundaries={1}
          color="blue"
          onChange={setPage}
        />
      </div>
    </>
  );
};

export default CertificationTable;

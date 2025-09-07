import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetCertificationsQuery } from "../../../../features/api/certificationSlice";
import { useState } from "react";
import NoDataMessage from "../../../../components/ui/NoDataMessage";

const CertificationTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: certifications,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetCertificationsQuery({
    page,
    limit,
  });

  if (!isLoading && certifications?.data?.length === 0) {
    return (
      <NoDataMessage message="certifications" onRefresh={() => refetch()} loading={isFetching}/>
    );
  }

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
          disabled={isFetching}
        />
      </div>
    </>
  );
};

export default CertificationTable;

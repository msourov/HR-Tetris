import { Container, Stack, Pagination, Flex } from "@mantine/core";
import CertificateCard from "./CCCard";
import { useGetCredentialsQuery } from "../../../features/api/companyCredentialSlice.ts";
import { useState } from "react";
import AppLoader from "../../../components/ui/AppLoader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../../../features/auth/authSlice.ts";
import { useDispatch } from "react-redux";
import NoDataMessage from "../../../components/ui/NoDataMessage.tsx";

// Main list view component
const CertificateList = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const limit = 5;
  const { data, isLoading, error, refetch, isFetching } =
    useGetCredentialsQuery({
      page,
      limit,
    });
  // const { logout } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      dispatch(logout());
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <Container size="lg" py="xl">
      {Array.isArray(data?.data) && data?.data.length > 0 ? (
        <>
          <Stack gap="md">
            {data?.data?.map((item) => (
              <CertificateCard key={item.id} item={item} />
            ))}
          </Stack>

          <Flex justify="flex-end" mt="xl">
            <Pagination
              value={data?.pagination.page ?? 1}
              total={data?.pagination.total_pages ?? 1}
              siblings={1}
              boundaries={1}
              color="blue"
              onChange={setPage}
            />
          </Flex>
        </>
      ) : (
        <NoDataMessage onRefresh={refetch} loading={isFetching} />
      )}
    </Container>
  );
};

export default CertificateList;

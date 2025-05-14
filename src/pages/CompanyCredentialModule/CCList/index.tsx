import { Container, Stack, Pagination, Flex } from "@mantine/core";
import CertificateCard from "./CCCard";
import { useGetCredentialsQuery } from "../../../features/api/CLMSlice";
import { useState } from "react";
import AppLoader from "../../../components/ui/AppLoader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../services/auth/useAuth";
import CreateCredentialModal from "../AddCLM.tsx";

// Main list view component
const CertificateList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useGetCredentialsQuery({
    page,
    limit,
  });
  const { logout } = useAuth();

  if (isLoading) {
    return <AppLoader />;
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
    <Container size="lg" py="xl">
      <CreateCredentialModal />
      <Stack gap="lg">
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
    </Container>
  );
};

export default CertificateList;

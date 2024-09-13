import {
  Text,
  Modal,
  Box,
  SimpleGrid,
  Loader,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useGetPoliciesQuery,
  useGetPolicyDetailQuery,
} from "../../../../features/api/policySlice";
import { useAuth } from "../../../../services/auth/useAuth";
import "../../../../styles.css";
import PDFViewer from "./PDFViewer";
import { AllPolicy } from "../../../../features/api/types";
import PolicyCard from "./PolicyCard";
import axios from "axios";

interface PolicyModalProps {
  opened: boolean;
  onClose: () => void;
  policyDetail: { data?: AllPolicy } | null;
  policyDetailLoading: boolean;
}

const PolicyList = () => {
  const [opened, setOpened] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [policyUid, setPolicyUid] = useState("");
  const { logout } = useAuth();
  const {
    data: policies,
    isLoading: allPolicyLoading,
    error: allPolicyError,
  } = useGetPoliciesQuery({
    page: 1,
    limit: 100,
  });

  useEffect(() => {
    if (selectedUid) {
      axios
        .get(
          `https://api.hr-infozilion.pitetris.com/v1/mak/policy/show/file/${selectedUid}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.download = "policy-file.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setSelectedUid(null);
        })
        .catch((error) => {
          console.error("Failed to download file", error);
        });
    }
  }, [selectedUid]);

  const policyFiles: AllPolicy[] = [];
  const policyTexts: AllPolicy[] = [];

  if (policies) {
    policies?.data.map((policy) =>
      policy.descriptions ? policyTexts.push(policy) : policyFiles.push(policy)
    );
  }

  const { data: policyDetail, isLoading: policyDetailLoading } =
    useGetPolicyDetailQuery({ uid: policyUid }, { skip: !policyUid });

  if (
    allPolicyError &&
    "status" in allPolicyError &&
    allPolicyError.status === 401
  ) {
    logout();
  }

  if (allPolicyLoading) {
    return (
      <div className="flex justify-center m-6">
        <Loader color="blue" />
      </div>
    );
  }

  const handlePolicyDetail = (id: string) => {
    setPolicyUid(id);
    setOpened(true);
  };

  const handleDownload = (uid: string) => {
    setSelectedUid(uid);
  };

  return (
    <Box className="mt-6">
      <h2 className="text-xl text-center text-gray-500">Text Policies</h2>
      <Divider />
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
        mt="lg"
      >
        {policyTexts?.map((item) => (
          <PolicyCard
            key={item?.id}
            item={item}
            onClick={handlePolicyDetail}
            isFile={false}
          />
        ))}

        <PolicyModal
          opened={opened}
          onClose={() => setOpened(false)}
          policyDetail={policyDetail || null}
          policyDetailLoading={policyDetailLoading}
        />
      </SimpleGrid>
      <h2 className="text-xl text-center mt-4 text-gray-500">Files</h2>
      <Divider />
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
        mt="lg"
      >
        {policyFiles?.map((item) => (
          <PolicyCard
            key={item?.id}
            item={item}
            onClick={handleDownload}
            isFile={true}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PolicyList;

const PolicyModal: React.FC<PolicyModalProps> = ({
  opened,
  onClose,
  policyDetail,
  policyDetailLoading,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} size="80%">
      {policyDetailLoading ? (
        <Loader />
      ) : !policyDetail?.data?.descriptions ? (
        <PDFViewer uid={policyDetail?.data?.uid} />
      ) : (
        <ScrollArea className="lg:px-10 sm:px-6 lg:max-h-[70vh] sm:h-[80vh]">
          <Text ta="center" fw={700} size="xl">
            {policyDetail?.data?.name}
          </Text>
          <Divider />
          <div
            dangerouslySetInnerHTML={{
              __html:
                policyDetail?.data?.descriptions || "No description available",
            }}
            style={{ margin: 0 }}
            className="description-content"
          />
          <Text size="sm" color="dimmed" className="mt-6">
            {policyDetail?.data?.logs?.message} by{" "}
            {policyDetail?.data?.logs?.admin} on{" "}
            {policyDetail?.data?.logs?.create_at
              ? new Date(policyDetail.data.logs.create_at).toLocaleDateString()
              : "Date not available"}
          </Text>
        </ScrollArea>
      )}
    </Modal>
  );
};

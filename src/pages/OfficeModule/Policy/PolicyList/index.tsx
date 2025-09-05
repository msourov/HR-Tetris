import {
  Text,
  Box,
  SimpleGrid,
  Card,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useGetPoliciesQuery,
  useGetPolicyDetailQuery,
} from "../../../../features/api/policySlice";
import "../../../../styles.css";
// import { AllPolicy } from "../../../../features/api/typesOld";
// import PolicyCard from "./PolicyCard";
import axios from "axios";
import AppLoader from "../../../../components/ui/AppLoader";
import {
  IconFile,
  IconFileText,
  IconFileTypeDoc,
  IconFileTypePdf,
} from "@tabler/icons-react";
import PolicyCard from "./PolicyCard";
import { AllPolicy } from "../../../../features/types/policy";
import PolicyDetail from "../PolicyDetail";

const PolicyList = () => {
  const [viewMode, setViewMode] = useState<"all" | "text" | "file">("all");
  const [opened, setOpened] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [policyUid, setPolicyUid] = useState("");

  const {
    data: policies,
    isLoading: allPolicyLoading,
    error: allPolicyError,
  } = useGetPoliciesQuery({
    page: 1,
    limit: 100,
  });

  console.log(allPolicyError, "allPolicyError");

  useEffect(() => {
    if (selectedUid) {
      axios
        .get(
          `${import.meta.env.VITE_APP_BASE_URL}policy/show/file/${selectedUid}`,
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
    Array.isArray(policies.data) &&
      policies.data?.forEach((policy) =>
        policy.descriptions
          ? policyTexts.push(policy)
          : policyFiles.push(policy)
      );
  }

  const { data: policyDetail, isLoading: policyDetailLoading } =
    useGetPolicyDetailQuery({ uid: policyUid }, { skip: !policyUid });

  if (allPolicyLoading) {
    return <AppLoader />;
  }

  const handlePolicyDetail = (id: string) => {
    setPolicyUid(id);
    setOpened(true);
  };

  const handleDownload = (uid: string) => {
    setSelectedUid(uid);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName?.includes(".pdf"))
      return <IconFileTypePdf size={20} color="#E62B2B" />;
    if (fileName?.includes(".doc") || fileName?.includes(".docx"))
      return <IconFileTypeDoc size={20} color="#2B5BE6" />;
    return <IconFile size={20} />;
  };

  // Filter policies based on view mode
  const filteredPolicies =
    viewMode === "all"
      ? [...policyTexts, ...policyFiles]
      : viewMode === "text"
      ? policyTexts
      : policyFiles;

  return (
    <Box className="mt-4">
      <Group justify="end" mb="lg">
        <SegmentedControl
          // color="violet"
          // bg={"white"}
          value={viewMode}
          onChange={(value) => setViewMode(value as "all" | "text" | "file")}
          data={[
            { label: "All Policies", value: "all" },
            { label: "Text Policies", value: "text" },
            { label: "File Policies", value: "file" },
          ]}
          size="sm"
        />
      </Group>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: viewMode === "file" ? 4 : 3 }}
        spacing="lg"
      >
        {filteredPolicies.map((item) => (
          <PolicyCard
            key={item.id}
            item={item}
            onView={handlePolicyDetail}
            onDownload={handleDownload}
            getFileIcon={getFileIcon}
          />
        ))}
      </SimpleGrid>

      {filteredPolicies.length === 0 && (
        <Card withBorder className="text-center py-10">
          <IconFileText size={40} className="mx-auto text-gray-400 mb-4" />
          <Text c="dimmed">No policies found</Text>
        </Card>
      )}

      <PolicyDetail
        opened={opened}
        onClose={() => setOpened(false)}
        policyDetail={
          policyDetail && "data" in policyDetail
            ? {
                data: Array.isArray(policyDetail.data)
                  ? policyDetail.data[0]
                  : policyDetail.data,
              }
            : null
        }
        policyDetailLoading={policyDetailLoading}
      />
    </Box>
  );
};

export default PolicyList;

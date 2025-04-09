import {
  Text,
  Modal,
  Box,
  SimpleGrid,
  Loader,
  ScrollArea,
  Divider,
  Tabs,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useGetPoliciesQuery,
  useGetPolicyDetailQuery,
} from "../../../../features/api/policySlice";
import { useAuth } from "../../../../services/auth/useAuth";
import "../../../../styles.css";
import PDFViewer from "./PDFViewer";
import { AllPolicy } from "../../../../features/api/typesOld";
import PolicyCard from "./PolicyCard";
import axios from "axios";
import { IoTextSharp } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";

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
    Array.isArray(policies.data) &&
      policies.data?.map((policy) =>
        policy.descriptions
          ? policyTexts.push(policy)
          : policyFiles.push(policy)
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
      <Divider
        label={
          <Text className="font-bold text-xl text-gray-500">Policies</Text>
        }
        labelPosition="center"
        className="my-6"
      />
      <Tabs variant="outline" defaultValue="text">
        <Tabs.List>
          <Tabs.Tab value="text" leftSection={<IoTextSharp />}>
            Text
          </Tabs.Tab>
          <Tabs.Tab value="file" leftSection={<FaRegFileAlt />}>
            Files
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="text" className="p-6">
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {policyTexts?.map((item) => (
              <div key={item?.id} className="flex justify-center bg-gray-200">
                <PolicyCard
                  key={item.id}
                  item={item}
                  onClick={handlePolicyDetail}
                  isFile={false}
                />
              </div>
            ))}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="file" className="p-4 my-6">
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {policyFiles?.map((item) => (
              <div
                key={item?.id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <PolicyCard
                  key={item?.id}
                  item={item}
                  onClick={handleDownload}
                  isFile={true}
                />
              </div>
            ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      <PolicyModal
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

const PolicyModal: React.FC<PolicyModalProps> = ({
  opened,
  onClose,
  policyDetail,
  policyDetailLoading,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} size="80%" withCloseButton={false}>
      {policyDetailLoading ? (
        <Loader type="dots" />
      ) : !policyDetail?.data?.descriptions ? (
        <PDFViewer uid={policyDetail?.data?.uid} />
      ) : (
        <ScrollArea className="lg:px-10 sm:px-6 lg:max-h-[60vh] sm:h-[80vh]">
          <Divider
            my="xs"
            label={
              <p className="text-lg text-blue-400">
                {policyDetail?.data?.name}
              </p>
            }
            labelPosition="center"
          />
          <div
            dangerouslySetInnerHTML={{
              __html:
                policyDetail?.data?.descriptions || "No description available",
            }}
            className="description-content bg-gray-100 p-4 mt-4"
          />
          <Text
            size="sm"
            color="white"
            className="mt-6 bg-gray-400 w-fit px-4 py-1 rounded-md"
          >
            {policyDetail?.data?.logs?.message} by{" "}
            {policyDetail?.data?.logs?.admin} on{" "}
            {policyDetail?.data?.logs?.create_at
              ? new Date(policyDetail.data.logs.create_at).toLocaleDateString()
              : "Date not available"}
          </Text>
        </ScrollArea>
      )}
      <div className="flex justify-end mr-10">
        <Button variant="outline" color="blue" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

import { Button, Divider, FileInput, Select, Text } from "@mantine/core";
import { DocumentList } from ".";
import { useEffect, useState } from "react";
import {
  DocumentExtensions,
  Employee,
} from "../../../../features/types/employee";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

type AddDocumentProps = {
  editFormData?: Employee;
  editLoading: boolean;
  refetchDocs: () => void;
};

const AddDocument: React.FC<AddDocumentProps> = ({
  editFormData,
  editLoading,
  refetchDocs,
}) => {
  const [documentType, setDocumentType] = useState<string | null>("");
  const [employeeDoc, setEmployeeDoc] = useState<
    DocumentExtensions | undefined
  >();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmployeeDoc(editFormData?.document_extensions);
  }, [editFormData]);

  const documentOptions = [
    { value: "cv", label: "CV" },
    { value: "nid", label: "NID" },
    { value: "tin", label: "TIN" },
    { value: "birth_certificate", label: "Birth Certificate" },
    { value: "academic", label: "Academic" },
    { value: "passport", label: "Passport" },
    { value: "joining_letter", label: "Joining Letter" },
    { value: "noc", label: "NOC" },
    { value: "professional", label: "Professional" },
    { value: "non_disclosure_agreement", label: "Non-disclosure Agreement" },
    { value: "utility", label: "Utility Bill" },
    { value: "image", label: "Image" },
  ];

  const handleDocumentUpload = async () => {
    setLoading(true);
    const eId = editFormData?.work?.employee_id;
    console.log(eId, "eId");
    if (!eId) {
      notifications.show({
        title: "Error!",
        message: "Please select an employee",
        icon: <IconX />,
        color: "red",
      });
      setLoading(false);
      return;
    }
    if (!documentType) {
      notifications.show({
        title: "Error!",
        message: "Please select a document type",
        icon: <IconX />,
        color: "red",
      });
      setLoading(false);
      return;
    }
    if (!file) {
      notifications.show({
        title: "Error!",
        message: "Please select a file to upload",
        icon: <IconX />,
        color: "red",
      });
      setLoading(false);
      return;
    }
    // File size validation (5 MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      notifications.show({
        title: "Error!",
        message: "File size exceeds 5 MB limit.",
        icon: <IconX />,
        color: "red",
      });
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("employee_id", eId);
      const dType = "is_" + documentType;
      formData.append(dType, "true");
      if (file instanceof File) {
        formData.append("upload_file", file, file.name);
      }
      const result = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}employee/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDocumentType(null);
      setFile(null);
      refetchDocs();
      notifications.show({
        title: "Success!",
        message: result.data.message || "Document uploaded successfully",
        icon: <IconCheck />,
        color: "green",
      });
    } catch (error) {
      console.error("Failed to upload document", error);
      notifications.show({
        title: "Error!",
        message: "Failed to upload document",
        icon: <IconX />,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Text c="dimmed" size="lg" ta="center">
        Upload Employee Documents
      </Text>
      <Divider w={"100%"} mx={"auto"} mb={"1rem"} />

      <div className="flex flex-grow flex-col gap-2">
        {/* Select Document Type */}
        <Select
          label="Type"
          placeholder="Select document type"
          data={documentOptions}
          value={documentType}
          onChange={(value) => setDocumentType(value || "")}
        />

        {/* File Input */}
        {documentType && (
          <FileInput
            label={`Upload ${documentType}`}
            placeholder="Choose file"
            accept="image/*,.pdf,.doc,.docx"
            value={file}
            onChange={(value) => setFile(value || null)}
            disabled={editLoading}
          />
        )}
      </div>
      <div className="flex gap-2 flex-col mt-6">
        <Button
          fullWidth
          onClick={handleDocumentUpload}
          disabled={editLoading || !documentType || !file}
          className="mt-auto"
          loading={loading}
        >
          Upload
        </Button>
        <Button
          fullWidth
          variant="outline"
          color="gray"
          onClick={() => {
            setDocumentType(null);
            setFile(null);
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <DocumentList
          employeeId={editFormData?.work?.employee_id || ""}
          documents={employeeDoc}
        />
      </div>
    </div>
  );
};

export default AddDocument;

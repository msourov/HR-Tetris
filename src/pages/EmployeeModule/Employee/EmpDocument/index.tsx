import { Card, Group, Text, ActionIcon, Tooltip } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { DocumentExtensions } from "../../../../features/types/employee";

interface DocumentListProps {
  employeeId: string;
  documents: DocumentExtensions | undefined;
}

export function DocumentList({ employeeId, documents }: DocumentListProps) {
  const entries =
    documents && Object.entries(documents).filter(([, v]) => v != null);

  if (entries && entries.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        No documents uploaded yet.
      </Text>
    );
  }

  const handleFileDownload = async (key: string, ext: string) => {
    try {
      const fileUrl = `${import.meta.env.VITE_APP_BASE_URL}employee/show/file?employee_id=${employeeId}&is_${key}=true`;

      const response = await fetch(fileUrl, {
        method: "GET",
        // credentials: "include", // uncomment if backend requires cookies/auth
      });

      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${key}.${ext}`; // file name
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Release the blob URL
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {entries &&
        entries.map(([key, ext]) => (
          <Card
            key={key}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            className="flex justify-center flex-col items-center"
          >
            <Text fw={500}>
              {key.replace(/_/g, " ").toUpperCase()}{" "}
              <span className="text-gray-500">({ext})</span>
            </Text>

            <Group>
              <Tooltip label="Download">
                <ActionIcon
                  component="a"
                  // href={`${baseUrl}/employee/download/${key}`}
                  target="_blank"
                  variant="light"
                  color="blue"
                  radius="xl"
                  size="lg"
                  onClick={() => handleFileDownload(key, ext)}
                >
                  <IconDownload size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Card>
        ))}
    </div>
  );
}

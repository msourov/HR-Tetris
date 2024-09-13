import { Button, Card, Text } from "@mantine/core";
import { AllPolicy } from "../../../../features/api/types";
import { IconDownload } from "@tabler/icons-react";

interface PolicyCardProps {
  item: AllPolicy;
  onClick: (id: string) => void;
  isFile: boolean; // New prop to determine if it's a file or text policy
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  item,
  onClick,
  isFile,
}) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      key={item?.id}
    >
      <Text fw={500} ta="center" pb="0.5rem">
        {item?.name}
      </Text>

      <Text size="sm" className="leading-6" pt="0.5rem">
        {item?.descriptions?.length > 300 ? (
          <span
            dangerouslySetInnerHTML={{
              __html: `${item?.descriptions.substring(0, 300)}...`,
            }}
          />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: item?.descriptions }} />
        )}
      </Text>

      <Text size="xs" color="dimmed" mb={10}>
        Created: {new Date(item?.create_at).toLocaleDateString()}
      </Text>

      {isFile ? (
        <Button
          leftSection={<IconDownload />}
          w="60%"
          mx="auto"
          bg="orange"
          onClick={() => onClick(item?.uid)}
        >
          Download
        </Button>
      ) : (
        <Button
          size="xs"
          onClick={() => onClick(item?.uid)}
          style={{ marginTop: "auto", width: "50%", marginInline: "auto" }}
          bg="orange"
        >
          See More
        </Button>
      )}
    </Card>
  );
};

export default PolicyCard;

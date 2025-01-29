import { Button, Card, Text } from "@mantine/core";
import { AllPolicy } from "../../../../features/api/typesOld";
import { IconDownload } from "@tabler/icons-react";
import dayjs from "dayjs";

interface PolicyCardProps {
  item: AllPolicy;
  onClick: (id: string) => void;
  isFile: boolean; // New prop to determine if it's a file or text policy
}

const PolicyCard: React.FC<PolicyCardProps> = ({ item, onClick, isFile }) => {
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      key={item?.id}
    >
      <Text my="xs" className="w-fit px-2 border-b-2 rounded-md mx-auto">
        {item?.name}
      </Text>

      <Text size="sm" className="leading-6">
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

      <Text size="xs" color="dimmed" my={10}>
        Created:{" "}
        <span className="text-amber-600 text-sm font-mono">
          {dayjs(item?.create_at).format("MMM D, YYYY h:mm A")}
        </span>
      </Text>

      {isFile ? (
        <Button
          leftSection={
            <IconDownload className="size-6 animate-bounce transition-all duration-300 ease-in-out hover:scale-110" />
          }
          w={160}
          mx="auto"
          mt={16}
          variant="light"
          radius="md"
          onClick={() => onClick(item?.uid)}
        >
          Download
        </Button>
      ) : (
        <Button
          size="xs"
          mt={16}
          onClick={() => onClick(item?.uid)}
          style={{ marginTop: "auto", width: "50%", marginInline: "auto" }}
        >
          See More
        </Button>
      )}
    </Card>
  );
};

export default PolicyCard;

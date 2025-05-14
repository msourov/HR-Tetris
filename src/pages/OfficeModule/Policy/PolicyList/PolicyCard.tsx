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
      withBorder
      className="flex flex-col shadow-lg px-6 py-4 max-w-[400px]"
      key={item?.id}
    >
      <div className="flex justify-between items-center">
        <Text className="w-fit font-bold text-green-900">{item?.name}</Text>
        <Button variant="light" size="compact-sm" className="text-xs">
          Review
        </Button>
      </div>

      <Text size="sm" className="leading-6 my-4 text-gray-500">
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
          mx="auto"
          mt={16}
          variant="light"
          radius="md"
          onClick={() => onClick(item?.uid)}
          className="w-full"
        >
          <IconDownload className="size-6 animate-bounce transition-all duration-300 ease-in-out hover:scale-110" />
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

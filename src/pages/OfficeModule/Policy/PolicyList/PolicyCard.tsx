import { Button, Modal, Text } from "@mantine/core";
import { AllPolicy } from "../../../../features/api/typesOld";
import { IconDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import CardGlass from "../../../../components/ui/CardGlass";
import { useDisclosure } from "@mantine/hooks";
import PolicyReviewModal from "./PolicyReviewModal";

interface PolicyCardProps {
  item: AllPolicy;
  onClick: (id: string) => void;
  isFile: boolean; // New prop to determine if it's a file or text policy
}

const PolicyCard: React.FC<PolicyCardProps> = ({ item, onClick, isFile }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CardGlass
      className={`flex flex-col px-4 py-4 h-full ${
        isFile ? "w-[200px]" : "w-[340px]"
      }`}
      key={item?.id}
    >
      <div className="flex justify-between items-center">
        <Text className="max-w-[75%] font-bold text-green-900 leading-6 truncate">
          {item?.name}
        </Text>
        <Button
          variant="light"
          size="compact-sm"
          className="text-xs"
          onClick={open}
        >
          Review
        </Button>
      </div>

      <Text
        size="sm"
        className="leading-6 my-4 text-gray-500 line-clamp-3 flex-grow"
      >
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
          mt={4}
          variant="light"
          radius="md"
          onClick={() => onClick(item?.uid)}
          className="w-full"
        >
          <IconDownload className="size-6 animate-bounce transition-all duration-300 ease-in-out hover:scale-110" />
        </Button>
      ) : (
        <Button
          w="100%"
          mt={4}
          onClick={() => onClick(item?.uid)}
          className="mt-auto"
        >
          See More
        </Button>
      )}
      <Modal opened={opened} onClose={close}>
        <PolicyReviewModal uid={item?.uid} close={close} />
      </Modal>
    </CardGlass>
  );
};

export default PolicyCard;

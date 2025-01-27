import { Card, Text, Group, Badge, Button } from "@mantine/core";

const OvertimeLeaveSkeleton = () => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="flex flex-row items-start gap-4"
    >
      {/* Left Section */}
      <div className="flex-1">
        <Text size="lg" fw={500} className="bg-gray-200 w-40 h-6 rounded-sm">
          {/* Skeleton for Employee Name */}
        </Text>
        <Text
          color="dimmed"
          size="sm"
          mt="xs"
          className="bg-gray-200 w-60 h-4 rounded-sm"
        >
          {/* Skeleton for Purpose */}
        </Text>
        <Group gap="xs" mt="sm">
          <Badge
            color="gray"
            variant="light"
            className="bg-gray-300 text-transparent w-24 h-5"
          >
            {/* Skeleton for Date */}
          </Badge>
          <Badge
            color="gray"
            variant="light"
            className="bg-gray-300 text-transparent w-24 h-5"
          >
            {/* Skeleton for Date */}
          </Badge>
        </Group>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-2">
        <Badge
          size="lg"
          color="gray"
          className="bg-gray-300 text-transparent w-24 h-6"
        >
          {/* Skeleton for Status */}
        </Badge>
        <Button
          variant="light"
          size="xs"
          disabled
          className="bg-gray-300 w-16 h-6"
        >
          {/* Skeleton for Button */}
        </Button>
      </div>
    </Card>
  );
};

export default OvertimeLeaveSkeleton;

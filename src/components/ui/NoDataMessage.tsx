import { Box, Text, Button } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons-react";

interface NoDataProps {
  message?: string;
  onRefresh?: () => void;
  loading: boolean;
}

const NoDataMessage = ({
  message = "data",
  onRefresh,
  loading,
}: NoDataProps) => {
  return (
    <Box className="flex flex-col items-center justify-center text-center py-12 px-4 text-gray-500">
      <IconMoodEmpty size={48} stroke={1.5} className="text-gray-400 mb-4" />
      <Text size="lg" fw={500} className="mb-1">
        {`No ${message} found!`}
      </Text>
      {onRefresh && (
        <Button
          size="xs"
          variant="outline"
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      )}
    </Box>
  );
};

export default NoDataMessage;

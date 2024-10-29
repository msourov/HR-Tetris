import { Button, Box, Text, Title, Paper, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container size="xs" px="xs" my="xl">
      <Paper shadow="xl" p="xl" radius="md">
        <Box>
          <Title order={1} c="red" mb="md">
            Oops!
          </Title>
          <Text color="dimmed" size="lg" mb="lg">
            Sorry, Page not found!
          </Text>
          {/* <Box mb="md">
            <Text size="sm" color="gray">
              <i>{error.statusText || "Unknown Error"}</i>
            </Text>
            {error.data && (
              <Text size="sm" color="gray">
                <i>{error.data}</i>
              </Text>
            )}
          </Box> */}
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="outline"
            color="gray"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

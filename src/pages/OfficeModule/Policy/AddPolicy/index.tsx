import { Box, Button } from "@mantine/core";
import { ContextModalProps, modals } from "@mantine/modals";

const AddPolicy = ({
  context,
  id,
}: // innerProps,
ContextModalProps<{ modalBody: string }>) => {
  const handleCreatePolicy = () => {
    context.closeModal(id); // Close the current modal
    modals.openContextModal({
      modal: "createPolicy",
      centered: true,
      innerProps: {
        // Pass any props needed for the next modal
      },
      size: "xl",
    });
  };

  const handleUploadPolicy = () => {
    context.closeModal(id); // Close the current modal
    modals.openContextModal({
      modal: "uploadPolicy",
      centered: true,
      innerProps: {
        // Pass any props needed for the next modal
      },
    });
  };
  console.log("context", context);
  return (
    <>
      {/* <Text size="sm">{innerProps.modalBody}</Text> */}
      <Box className="pb-10 flex flex-col">
        <Button mt="md" onClick={handleCreatePolicy} bg="orange">
          Create Policy
        </Button>
        <Button mt="md" onClick={handleUploadPolicy} bg="orange">
          Upload Policy
        </Button>
      </Box>
    </>
  );
};

export default AddPolicy;

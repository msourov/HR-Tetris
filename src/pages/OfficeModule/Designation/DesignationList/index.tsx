import {
  Box,
  Button,
  Card,
  Loader,
  Modal,
  Pill,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { LuPlusCircle } from "react-icons/lu";
import { useDisclosure } from "@mantine/hooks";
import { useGetDesignationsQuery } from "../../../../features/api/designationSlice";
import AddNewDesignation from "../AddNewDesignation";

const DesignationList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    data: designationData,
    isLoading,
    error,
  } = useGetDesignationsQuery({ page: 1, limit: 10 });
  console.log("designationData", designationData);

  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <p>Something went wrong.</p>;
  }

  const toggleModal = () => {
    close();
  };

  return (
    <Box>
      <Box className="flex justify-end">
        <Button
          leftSection={<LuPlusCircle />}
          // size="compact-sm"
          color="black"
          variant="light"
          mt={-24}
          mb={16}
          onClick={open}
        >
          Add
        </Button>
      </Box>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {designationData?.data?.map((item) => (
          <Card
            shadow="sm"
            // padding="xl"
            component="a"
            withBorder
            maw={250}
            className="text-center flex-auto p-4 max-w-full overflow-hidden py-6 gap-2"
          >
            <Text fw={500} size="lg" className="truncate">
              {item?.name}
            </Text>
            {/* <Card.Section className="flex py-4 px-2 justify-end"> */}
            <Text component="span">
              <Pill
                size="sm"
                c="dimmed"
                className={item?.active ? "bg-green-200" : "bg-gray-200"}
              >
                {`${item?.active ? "Active" : "Inactive"}`}
              </Pill>
            </Text>
            {/* </Card.Section> */}

            {/* <Button
                className="bg-black hover:bg-gray-700 mx-auto"
                size="compact-sm"
                my={16}
                maw={"80%"}
              >
                Show Details
              </Button> */}
          </Card>
        ))}
      </SimpleGrid>
      <Modal opened={opened} onClose={close} title="Add Department">
        <AddNewDesignation toggleModal={toggleModal} />
      </Modal>
    </Box>
  );
};

export default DesignationList;

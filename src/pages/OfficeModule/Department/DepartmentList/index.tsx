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
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../../../features/api/departmentSlice";
import AddNewDepartment from "../AddNewDepartment";

const DepartmentList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const {
    data: departmentData,
    isLoading,
    error,
  } = useGetDepartmentsQuery({ page: 1, limit: 10 });
  console.log("departmentData", departmentData);

  const toggleModal = () => {
    close();
  };

  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <p>Something went wrong.</p>;
  }
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
        cols={{ sm: 3, md: 5, xl: 6 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {departmentData?.data?.map((item) => (
          <Card
            shadow="sm"
            // padding="xl"
            component="a"
            withBorder
            maw={250}
            className="text-center flex-auto max-w-full overflow-hidden py-6 gap-2 cursor-pointer"
            onClick={() => navigate(`${item?.name}/detail`)}
          >
            <Text fw={500} size="md" className="truncate">
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
          </Card>
        ))}
      </SimpleGrid>
      <Modal opened={opened} onClose={close} title="Add Department">
        <AddNewDepartment toggleModal={toggleModal} />
      </Modal>
    </Box>
  );
};

export default DepartmentList;

import { Outlet } from "react-router-dom";

const CategoryLayout = () => {
  return (
    <div>
      {/* <Box w={"100%"} px={"2.25rem"} className="flex justify-end py-4">
        <Button
          variant="filled"
          color="white"
          c="blue"
          size="sm"
          className="shadow-md text-sm hover:bg-blue-100 hover:text-white border-blue-300"
          leftSection={<IconPlus size={16} />}
          onClick={open}
        >
          Create Category
        </Button>
      </Box> */}

      <div className="flex flex-col">
        <div className="w-[95%] mb-8 mx-auto max-h-fit my-4 rounded-lg drop-shadow-lg flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {/* <Modal opened={opened} onClose={close} size="lg">
        <AddCategory closeModal={close} />
      </Modal> */}
    </div>
  );
};

export default CategoryLayout;

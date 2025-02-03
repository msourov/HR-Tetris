import { Button } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { IconPlus } from "@tabler/icons-react";

const HomeOfficeLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center mb-6 py-4 px-8">
        <div className="space-y-4">
          <Button
            variant="outline"
            color="black"
            size="compact-sm"
            leftSection={<IoMdReturnLeft size={16} color="gray" />}
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:bg-gray-200"
          >
            Back
          </Button>
        </div>

        <Button
          variant="filled"
          color="white"
          c="blue"
          size="sm"
          className="shadow-md text-sm hover:bg-blue-100 hover:text-white"
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("create")}
        >
          Add Home Office
        </Button>
      </div>
      <div className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeOfficeLayout;

import { Image } from "@mantine/core";
import { useGetCompanyQuery } from "../../../features/api/companySlice";
import { IconMapPin, IconPhone } from "@tabler/icons-react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../services/auth/useAuth";

const Company = () => {
  const {
    data: getCompany,
    isLoading,
    error,
  } = useGetCompanyQuery({ page: 1, limit: 10 });
  const { logout } = useAuth();
  console.log(getCompany);

  if (isLoading) {
    return <div className="m-auto">...loading</div>;
  }

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }
  return (
    <div className="relative w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg border-2 border-[#d4af37] p-10 mt-[5rem]">
      <div className="top-8 left-4 flex z-10 justify-between">
        <Image
          radius="md"
          fit="contain"
          src="./assets/logo.jpg"
          className=" w-[250px] z-10 -top-10 mx-1 fixed"
        />
        <p className="ml-auto text-gray-500 absolute -top-3.5 right-4 px-1 bg-white z-10">
          www.infozillionbd.com
        </p>
      </div>
      <div className="flex justify-between items-start pt-10">
        <div className="flex flex-col gap-2 my-auto">
          <div className="flex gap-2 items-center">
            <IconPhone size={18} />
            <p className="text-gray-500">Contact:</p>
            <p>+880-123456789</p>
          </div>
          <div className="flex gap-2 items-center">
            <IconMapPin size={18} />
            <p className="text-gray-500">Address:</p>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-end w-[40%]">
          <p className="text-gray-500">A tech company</p>
          <p className="text-gray-500">
            Lorem Ipsum is a piece of text, used by designers to fill a space
            where the content will eventually sit. It helps show how text will
            look once a piece of content is finished, during the planning phase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Company;

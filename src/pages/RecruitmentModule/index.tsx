import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";

const Recruitment = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <AppPageHeader
        Heading="Leave"
        Breadcrumb={{ module: "Recruitment Management", page: "Cadidates" }}
        ShowAddButton={false}
      />
      <Outlet />
    </div>
  );
};

export default Recruitment;

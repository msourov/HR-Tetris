import { Outlet } from "react-router-dom";

const Recruitment = () => {
  return (
    <div className="w-[95%] mx-auto rounded-lg drop-shadow-lg p-10">
      <Outlet />
    </div>
  );
};

export default Recruitment;

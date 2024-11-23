import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/shared/sidebar/Sidebar";
import Topbar from "./components/shared/Topbar";

const AppLayout: React.FC = () => {
  // useEffect(() => {
  //   console.log("AppLayout mounted");
  //   return () => {
  //     console.log("AppLayout unmounted");
  //   };
  // }, []);

  return (
    <div className="flex flex-col bg-gray-200 overflow-auto">
      <Topbar />
      <div className="flex flex-1 max-h-[90vh] overflow-hidden">
        <div className="w-2/8 h-full border-r-2 overflow-hidden">
          <Sidebar />
        </div>
        <div className="flex-1 h-screen">
          <div className="content overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AppLayout;

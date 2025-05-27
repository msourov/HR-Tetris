import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/shared/sidebar/Sidebar";
import Topbar from "./components/shared/Topbar";
import Footer from "./components/shared/Footer";

const AppLayout: React.FC = () => {
  // useEffect(() => {
  //   console.log("AppLayout mounted");
  //   return () => {
  //     console.log("AppLayout unmounted");
  //   };
  // }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <div className="w-2/8 h-auto">
          <Sidebar />
        </div>
        <div className="content flex-1 flex flex-col min-h-[calc(100vh-160px)] overflow-x-hidden">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;

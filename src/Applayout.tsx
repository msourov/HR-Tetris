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
    <div className="flex flex-col h-screen bg-gray-100 overflow-auto">
      <Topbar />
      <div className="flex flex-1">
        <div className="w-2/8 h-auto">
          <Sidebar />
        </div>
        <div className="content flex-1 h-min overflow-x-hidden">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;

import { Loader } from "@mantine/core";

const AppLoader = ({ size = "sm" }: { size?: string }) => {
  return (
    <div className="flex justify-center items-center h-32">
      <Loader size={size} />
    </div>
  );
};

export default AppLoader;

import { OvertimeData } from "../../../../features/api/types";
import CustomCard from "./CustomCard";

const OvertimeList = ({ data }: { data: OvertimeData[] }) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[85vh]">
      {data.map((item) => (
        <CustomCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default OvertimeList;

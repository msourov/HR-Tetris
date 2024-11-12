import { FC } from "react";
import { Leave } from "../../features/api/types";
import { Box, ScrollArea } from "@mantine/core";
import CustomCard from "../EmployeeModule/Leave/LeaveList/CustomCard";

type LeaveSectionProps = {
  data: Leave | Leave[];
};

const LeaveSection: FC<LeaveSectionProps> = ({ data }) => {
  return (
    <div>
      <ScrollArea
        type="scroll"
        offsetScrollbars
        h={"90vh"}
        style={{ overflowY: "hidden" }}
      >
        <Box className="mb-24 gap-4 flex flex-col">
          {data.map((item, index) => (
            <CustomCard
              key={item.id}
              {...{ ...item, is_approved: item.is_approved || "pending" }}
            />
          ))}
        </Box>
      </ScrollArea>
    </div>
  );
};

export default LeaveSection;

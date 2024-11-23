import { Box, ScrollArea } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leave } from "../../../../features/api/types";
import CustomCard from "./CustomCard";

const LeaveList = ({ data }: { data: Leave[] }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scrollBehavior: "smooth" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh]"
    >
      <ScrollArea
        type="scroll"
        offsetScrollbars
        h={"90vh"}
        style={{ overflowY: "hidden" }}
      >
        <Box className="mb-24 gap-4 flex flex-col">
          {data.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -100 * index }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
              }}
              viewport={{ once: true }}
            >
              <CustomCard
                key={item.id}
                {...{ ...item, is_approved: item.is_approved || "pending" }}
              />
            </motion.div>
          ))}
        </Box>
      </ScrollArea>
    </motion.div>
  );
};

export default LeaveList;

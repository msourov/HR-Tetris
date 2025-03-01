import { ScrollArea } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leave } from "../../../../features/api/typesOld";
import CustomCard from "./CustomCard";

const LeaveList = ({ data }: { data: Leave[] }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scrollBehavior: "smooth" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] py-4"
    >
      <ScrollArea
        type="scroll"
        offsetScrollbars
        // h={"90vh"}
        style={{ overflowY: "hidden" }}
      >
        <div className="mb-10 gap-4 flex flex-col">
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
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default LeaveList;

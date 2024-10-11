import { Box } from "@mantine/core";
import { OvertimeData } from "../../../../features/api/types";
import CustomCard from "./CustomCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const OvertimeList = ({ data }: { data: OvertimeData[] }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scrollBehavior: "smooth" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-y-auto"
    >
      <Box className="mb-4 gap-4 flex flex-col">
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
            <CustomCard key={item.id} {...item} />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
};

export default OvertimeList;

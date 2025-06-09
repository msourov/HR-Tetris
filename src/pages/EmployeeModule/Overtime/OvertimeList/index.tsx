import { Box, ScrollArea } from "@mantine/core";
import CustomCard from "./CustomCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Overtime } from "../../../../features/api/typesOld";

const OvertimeList = ({ data }: { data: Overtime[] }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scrollBehavior: "smooth" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 h-[70vh] sm:h-[75vh] md:h-[78vh] lg:h-[82vh] xl:h-[85vh]"
    >
      <ScrollArea
        offsetScrollbars
        className="relative h-full"
        styles={{
          viewport: {
            height: "100%",
          },
          scrollbar: {
            backgroundColor: "#e5e7eb",
          },
          thumb: {
            backgroundColor: "#4b5563",
            borderRadius: "4px",
          },
        }}
      >
        <Box className="mb-10 gap-4 flex flex-col">
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
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 z-10 bg-gradient-to-t from-white to-transparent" />
      </ScrollArea>
    </motion.div>
  );
};

export default OvertimeList;

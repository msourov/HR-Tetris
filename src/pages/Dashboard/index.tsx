import { useGetDashboardResponseQuery } from "../../features/api/companySlice";
import { motion } from "framer-motion";
import { Loader, Alert, Title, Card, Box, Image } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { employeeData } from "./DummyData";
import UpCounter from "./UpCounter";

const Dashboard = () => {
  const { data, isLoading, error } = useGetDashboardResponseQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader size="md" variant="bars" />
      </div>
    );
  }
  console.log(data?.data);
  if (error) {
    return <Alert color="red">Error loading dashboard data</Alert>;
  }

  // const { employee, leave, shift_schedule, designation, department } =
  //   data?.data || {};

  // Framer Motion animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex gap-4 m-10 justify-center md:flex-col lg:flex-row md:gap-10">
      <motion.div
        className="lg:w-[45%] md:w-[80%] my-auto mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <Card
          shadow="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-300 \
          flex xl:flex-row justify-center gap-6 py-10 \
          rounded-lg hover:shadow-xl transition-shadow"
        >
          <Box
            p="lg"
            className="bg-white shadow-md rounded-lg flex sm:justify-around gap-4"
          >
            <div>
              <Image
                radius="md"
                src="/public/assets/team.png"
                // h={60}
                // w="auto"
                // fit="contain"
                className="h-auto min-w-16 sm:w-16 sm:h-16 md:w-16 md:h-16"
                alt="Employee Icon"
              />
            </div>

            <Box className="flex flex-col">
              <Title
                order={5}
                className="flex flex-row gap-4 items-center text-gray-700"
              >
                <span className="font-semibold text-lg">Total</span>
              </Title>
              <UpCounter upperRange={100} />
            </Box>
          </Box>
          <Box
            p="lg"
            className="bg-white shadow-md rounded-lg flex sm:justify-around gap-2"
          >
            <Image
              radius="md"
              src="/public/assets/member.png"
              // h={60}
              // w="auto"
              // fit="contain"
              className="h-auto min-w-16 md:w-16 md:h-16"
              alt="Employee Icon"
            />
            <Box className="flex flex-col">
              <Title
                order={5}
                className="flex flex-row gap-4 items-center text-gray-700"
              >
                <span className="font-semibold text-lg">Active</span>
              </Title>
              <UpCounter upperRange={90} />
            </Box>
          </Box>
          <Box
            p="lg"
            className="bg-white shadow-md rounded-lg flex sm:justify-around gap-4"
          >
            <Image
              radius="md"
              src="/public/assets/unavailable.png"
              // h={60}
              // w="auto"
              // fit="contain"
              className="h-auto min-w-16 sm:w-16 sm:h-16 md:w-16 md:h-16"
              alt="Employee Icon"
            />
            <Box className="flex flex-col">
              <Title
                order={5}
                className="flex flex-row gap-4 items-center text-gray-700"
              >
                <span className="font-semibold text-lg">Inctive</span>
              </Title>
              <UpCounter upperRange={10} />
            </Box>
          </Box>
        </Card>
      </motion.div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="lg:w-[45%] md:w-[80%] mx-auto"
      >
        <Card shadow="sm" padding="lg" mb="lg" className="bg-zinc-200">
          <Title order={4} ta="center">
            Last 6 Months Employee Stats
          </Title>
          <BarChart
            h={300}
            data={employeeData}
            dataKey="month"
            withLegend
            series={[
              { name: "total", color: "violet.6" },
              { name: "active", color: "blue.6" },
              { name: "inactive", color: "teal.6" },
            ]}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;

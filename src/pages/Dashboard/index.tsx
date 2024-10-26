import { useGetDashboardResponseQuery } from "../../features/api/companySlice";
import { motion } from "framer-motion";
import { Loader, Alert, Title, Card, Box, Image } from "@mantine/core";
import { BarChart, LineChart } from "@mantine/charts";
import { biaxialData, employeeData } from "./DummyData";
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
    <div className="flex gap-4 m-10 flex-col md:gap-10">
      <Box className="flex flex-col xl:flex-row justify-evenly my-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <Card
            shadow="sm"
            className="
          flex flex-col md:flex-row justify-center gap-2 lg:py-10 \
          rounded-lg hover:shadow-md transition-shadow"
          >
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/team.png"
                fit="contain"
                className="min-w-10 w-12 h-12"
                alt="Employee Icon"
              />

              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-2 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">
                    Total Employees
                  </span>
                </Title>
                <UpCounter upperRange={100} />
              </Box>
            </Box>
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/member.png"
                // h={60}
                // w="auto"
                // fit="contain"
                className="min-w-12 w-12 h-12"
                alt="Employee Icon"
              />
              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-4 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">
                    Active Employees
                  </span>
                </Title>
                <UpCounter upperRange={90} />
              </Box>
            </Box>
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/unavailable.png"
                // h={60}
                // w="auto"
                // fit="contain"
                className="min-w-12 w-12 h-12"
                alt="Employee Icon"
              />
              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-4 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">
                    Inctive Employees
                  </span>
                </Title>
                <UpCounter upperRange={10} />
              </Box>
            </Box>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <Card
            shadow="sm"
            className="flex flex-col md:flex-row justify-center gap-2 lg:py-10 rounded-lg hover:shadow-md transition-shadow"
          >
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/project.png"
                className="min-w-12 w-12 h-12"
                alt="Projects Icon"
              />

              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-4 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">
                    Ongoing Projects
                  </span>
                </Title>
                <UpCounter upperRange={12} />
              </Box>
            </Box>

            {/* Departments Box */}
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/department.png"
                className="min-w-12 w-12 h-12"
                alt="Departments Icon"
              />

              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-4 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">Departments</span>
                </Title>
                <UpCounter upperRange={5} />
              </Box>
            </Box>

            {/* Open Positions Box */}
            <Box
              p="lg"
              className="bg-white border border-blue-300 rounded-lg flex flex-col xl:flex-row items-center sm:justify-around gap-2"
            >
              <Image
                src="/assets/planing.png"
                className="min-w-12 w-12 h-12"
                alt="Open Positions Icon"
              />
              <Box className="flex flex-col text-center">
                <Title className="flex flex-row gap-4 items-center text-gray-700">
                  <span className="font-semibold text-[1rem]">
                    Open Positions
                  </span>
                </Title>
                <UpCounter upperRange={8} />
              </Box>
            </Box>
          </Card>
        </motion.div>
      </Box>

      <Box className="flex flex-col md:flex-row justify-evenly">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className=" w-[40%] mx-auto"
        >
          <Card shadow="sm" padding="lg" mb="lg" className="">
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
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className=" w-[40%] mx-auto"
        >
          <Card shadow="sm" padding="lg" mb="lg" className="">
            <Title order={4} ta="center">
              Company growth
            </Title>
            <LineChart
              h={300}
              data={biaxialData}
              dataKey="name"
              withRightYAxis
              yAxisLabel="uv"
              rightYAxisLabel="pv"
              series={[
                { name: "uv", color: "pink.6" },
                { name: "pv", color: "cyan.6", yAxisId: "right" },
              ]}
            />
          </Card>
        </motion.div>
      </Box>
    </div>
  );
};

export default Dashboard;

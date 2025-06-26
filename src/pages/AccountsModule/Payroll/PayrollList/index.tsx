import {
  Text,
  Group,
  Stack,
  Container,
  Title,
  useMantineTheme,
  Modal,
  Button,
  TextInput,
  Paper,
  Badge,
  SimpleGrid,
  Select,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCurrencyTaka,
  IconCalendar,
  IconPlus,
  IconId,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddPayrollMutation,
  useGetPayrollsQuery,
} from "../../../../features/api/payrollSlice";
import { useState } from "react";
import { PayrollRecord } from "../../../../features/types/payroll";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import { useGetEmployeeHelperQuery } from "../../../../features/api/employeeSlice";
import AppLoader from "../../../../components/ui/AppLoader";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import CardGlass from "../../../../components/ui/CardGlass";
import AppModal from "../../../../components/ui/AppModal";

const createSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  salary: z.number().min(1, "Salary must be greater than 0"),
});

type CreatePayroll = z.infer<typeof createSchema>;

const PayrollList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, error } = useGetPayrollsQuery({
    page,
    limit,
  });
  const { data: employees } = useGetEmployeeHelperQuery();
  const [addPayroll, { isLoading: isAdding }] = useAddPayrollMutation();

  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(
    null
  );
  const theme = useMantineTheme();

  const payrolls = data?.data || [];

  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.employee_id,
      }))
    : [];

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePayroll>({
    resolver: zodResolver(createSchema),
  });

  const onSubmit = async (data: CreatePayroll) => {
    try {
      await addPayroll(data).unwrap();
      closeCreate();
    } catch (error) {
      console.error("Failed to create payroll:", error);
    }
  };

  const handleViewDetail = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    openDetail();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  if (isLoading) return <AppLoader />;

  if (error) {
    type ErrorWithDetail = { data?: { detail?: string } };
    const err = error as ErrorWithDetail;
    const errorMessage =
      err.data && typeof err.data === "object" && "detail" in err.data
        ? err.data.detail
        : "Error fetching users";
    return <ErrorAlert message={errorMessage || ""} />;
  }

  const SalaryItem = ({ label, value }: { label: string; value: number }) => (
    <Group justify="space-between">
      <Text c="dimmed">{label}</Text>
      <Text fw={500} className="flex items-center">
        <IconCurrencyTaka size={16} style={{ marginRight: 4 }} />
        {value?.toLocaleString() || "0"}
      </Text>
    </Group>
  );

  return (
    <Container size="xl" py="xl" mx={40}>
      <Group justify="end" mb="xl">
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={openCreate}
          color="blue"
        >
          Create Payroll
        </Button>
      </Group>

      <Stack gap="sm">
        {payrolls && payrolls.length > 0 ? (
          payrolls?.map((item) => (
            <CardGlass
              key={item.uid}
              className="cursor-pointer hover:shadow-md bg-slate-200"
              onClick={() => handleViewDetail(item)}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <img
                    src={getImageUrl(item?.employee_id)}
                    alt={item?.employee_name}
                    className="w-10 h-10 rounded-full mr-2 inline-block"
                    onError={handleImageError}
                  />

                  <Stack gap={2}>
                    <Text fz="md" fw={400} lineClamp={1}>
                      {item.employee_name}
                    </Text>
                    <Group gap="xs">
                      <Badge
                        variant="light"
                        color="blue"
                        leftSection={<IconId size={14} />}
                      >
                        {item.employee_id}
                      </Badge>
                      <Badge
                        variant="light"
                        color="orange"
                        leftSection={<IconCalendar size={14} />}
                      >
                        {item.month}
                      </Badge>
                    </Group>
                  </Stack>
                </Group>

                <Stack align="end" gap={2}>
                  <Text
                    fz="xl"
                    fw={700}
                    c="green"
                    className="flex items-center"
                  >
                    <IconCurrencyTaka size={20} style={{ marginRight: 4 }} />
                    {item.net_salary?.toLocaleString()}
                  </Text>
                  <Text fz="sm" c="dimmed">
                    Net Salary
                  </Text>
                </Stack>
              </Group>
            </CardGlass>
          ))
        ) : (
          <Text c="dimmed" ta="center" mt="xl">
            No payroll records found.
          </Text>
        )}
      </Stack>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination
          total={data?.pagination?.total_pages ?? 0}
          value={page}
          onChange={setPage}
          color="rgb(33, 41, 34)"
          disabled={isFetching}
        />
      </div>

      {/* Detail Modal */}
      <AppModal
        opened={detailOpened}
        onClose={closeDetail}
        size="lg"
        radius="md"
      >
        {selectedPayroll && (
          <Stack gap="lg">
            {/* Employee Info Section */}
            <Paper p="md" withBorder radius="sm">
              <Group gap="md">
                <img
                  src={getImageUrl(selectedPayroll?.employee_id)}
                  alt={selectedPayroll?.employee_name}
                  className="w-20 h-20 rounded-full mr-2 inline-block"
                  onError={handleImageError}
                />
                <Stack gap={4}>
                  <Text fz="xl" fw={600}>
                    {selectedPayroll.employee_name}
                  </Text>
                  <Group gap="xs">
                    <Badge
                      variant="light"
                      color="blue"
                      leftSection={<IconId size={14} />}
                    >
                      {selectedPayroll.employee_id}
                    </Badge>
                    <Badge
                      variant="light"
                      color="orange"
                      leftSection={<IconCalendar size={14} />}
                    >
                      {selectedPayroll.month}
                    </Badge>
                  </Group>
                </Stack>
              </Group>
            </Paper>

            {/* Salary Breakdown */}
            <Paper p="md" withBorder radius="sm">
              <Title
                order={4}
                mb="lg"
                c="blue"
                className="text-center border-b-2 pb-2"
                fw={400}
              >
                Salary Breakdown
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                <Stack gap={6}>
                  <SalaryItem
                    label="Base Salary"
                    value={selectedPayroll.base_salary}
                  />
                  <SalaryItem
                    label="Housing Allowance"
                    value={selectedPayroll.housing_allowance}
                  />
                  <SalaryItem
                    label="Conveyance Allowance"
                    value={selectedPayroll.conveyance_allowance}
                  />
                </Stack>
                <Stack gap={6}>
                  <SalaryItem
                    label="Medical Allowance"
                    value={selectedPayroll.medical_allowance}
                  />
                  <SalaryItem
                    label="Late Deductions"
                    value={selectedPayroll.late_deductions}
                  />
                  <SalaryItem label="Bonus" value={selectedPayroll.bonus} />
                </Stack>
              </SimpleGrid>
            </Paper>

            {/* Net Salary Card */}
            <Paper
              p="md"
              bg="green.0"
              radius="sm"
              style={{ border: `1px solid ${theme.colors.green[2]}` }}
            >
              <Group justify="space-between">
                <Text fz="lg" fw={600}>
                  Net Salary
                </Text>
                <Text fz="xl" fw={700} c="green.7">
                  <IconCurrencyTaka size={24} style={{ marginRight: 8 }} />
                  {selectedPayroll.net_salary?.toLocaleString()}
                </Text>
              </Group>
            </Paper>
          </Stack>
        )}
      </AppModal>

      {/* Create Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title="Create New Payroll"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Select
              variant="filled"
              label="Employee"
              placeholder="Select an employee"
              data={employeeOptions}
              {...register("employee_id")}
              onChange={(value) => setValue("employee_id", value || "")}
              error={errors.employee_id?.message}
              required
            />
            <TextInput
              label="Salary"
              type="number"
              {...register("salary", { valueAsNumber: true })}
              error={errors.salary?.message}
              rightSection={<IconCurrencyTaka size={18} />}
            />
            <Group justify="end" mt="md">
              <Button variant="default" onClick={closeCreate}>
                Cancel
              </Button>
              <Button type="submit" loading={isAdding}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default PayrollList;

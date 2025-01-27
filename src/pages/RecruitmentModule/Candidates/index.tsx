import {
  Button,
  Card,
  Divider,
  Loader,
  Pill,
  Popover,
  Select,
  SimpleGrid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useGetCandidatesQuery } from "../../../features/api/recruitmentSlice";
import { IoFilter } from "react-icons/io5";
import { useState } from "react";

const Candidates = () => {
  const { data: allCandidates, isLoading, error } = useGetCandidatesQuery();
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | null>(
    sessionStorage.getItem("filtered_department")
  );

  const navigate = useNavigate();
  const allDepartments = allCandidates?.data.map((item) => item.department);
  const uniqueDepartments = [...new Set(allDepartments)];

  const setDepartment = (value: string | null) => {
    if (value) {
      sessionStorage.setItem("filtered_department", value);
      setValue(sessionStorage.getItem("filtered_department") ?? null);
    }
  };

  let filteredData = allCandidates?.data;

  if (value) {
    filteredData = allCandidates?.data.filter(
      (item) => item.department === value
    );
  }
  if (isLoading) {
    <Loader type="dots" />;
  }
  if (error) {
    <p>{`Something went wrong. ${error}`}</p>;
  }
  return (
    <div>
      <div className="flex justify-end">
        <Popover
          opened={opened}
          onChange={setOpened}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button
              leftSection={<IoFilter />}
              size="compact-sm"
              bg="none"
              c="black"
              variant="outline"
              mt={-24}
              mb={16}
              onClick={() => setOpened((o) => !o)}
            >
              Filter
            </Button>
          </Popover.Target>
          <Popover.Dropdown bg="var(--mantine-color-body)">
            <Select
              placeholder="Select Department"
              comboboxProps={{ withinPortal: false }}
              data={uniqueDepartments}
              value={value}
              onChange={setDepartment}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="default"
                size="compact-sm"
                onClick={() => {
                  sessionStorage.removeItem("filtered_department");
                  setValue(null);
                  setOpened(false);
                }}
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="compact-sm"
                c="red"
                onClick={() => setOpened(false)}
              >
                Close
              </Button>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {filteredData?.map((item) => (
          <Card
            shadow="sm"
            // padding="xl"
            component="a"
            withBorder
            maw={350}
            className="text-center flex-auto p-4 max-w-full overflow-hidden py-6"
          >
            <p className="text-lg font-medium truncate">{item?.name}</p>
            <p className="text-sm truncate mb-2">{item?.email}</p>
            <p className="text-sm text-gray-500 mb-4">{item?.department}</p>
            <Divider />
            <Card.Section className="flex py-4 px-2 justify-between">
              <p className="text-sm">
                Applied:{" "}
                <span className="text-blue-500">
                  {item?.create_at.substring(0, 10)}
                </span>
              </p>
              <Pill size="sm" c="dimmed">
                {item?.state}
              </Pill>
            </Card.Section>
            <p className="line-clamp-2">{item?.cover_letter}</p>
            <Card.Section>
              <Button
                className="bg-black hover:bg-gray-700"
                size="compact-sm"
                my={16}
                onClick={() => navigate(`${item?.uid}/detail`)}
              >
                Show Details
              </Button>
            </Card.Section>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Candidates;

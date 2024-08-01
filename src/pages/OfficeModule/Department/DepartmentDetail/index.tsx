import { Card, Avatar, Group, Text, Grid } from "@mantine/core";
import { useParams } from "react-router-dom";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Software Engineer",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "DevOps Engineer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "UI/UX Designer",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Project Manager",
  },
];

const DepartmentDetail = () => {
  const { departmentName } = useParams();
  return (
    <div>
      <Text ta="center" size="xl" fw={700} mb="lg">
        {`${departmentName} Department`}
      </Text>
      <Grid>
        {users.map((user) => (
          <Grid.Col key={user.id} span={{ base: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group wrap="nowrap">
                <Avatar src={null} alt={user.name} color="blue">
                  {user.name.charAt(0)}
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {user.name}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user.email}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user.role}
                  </Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default DepartmentDetail;

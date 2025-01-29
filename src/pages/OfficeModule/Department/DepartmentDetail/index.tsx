import { Card, Avatar, Group, Grid } from "@mantine/core";
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
    <>
      <p className="text-center text-xl font-bold mb-6">
        {`${departmentName} Department`}
      </p>

      <Grid>
        {users.map((user) => (
          <Grid.Col key={user.id} span={{ base: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group wrap="nowrap">
                <Avatar src={null} alt={user.name} color="blue">
                  {user.name.charAt(0)}
                </Avatar>
                <>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default DepartmentDetail;

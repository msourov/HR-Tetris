import { useParams } from "react-router-dom";
import { useGetCandidateDetailQuery } from "../../../features/api/recruitmentSlice";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Loader,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import axios from "axios";

const CandidateDetail = () => {
  const { id: uid } = useParams<{ id?: string }>();
  const {
    data: candidate,
    isLoading,
    error,
  } = useGetCandidateDetailQuery({ uid: uid || "" });

  const candidateData = candidate?.data[0];

  const file_name = `${candidateData?.file_name}.${candidateData?.extension}`;
  // const { data: cvData } = useGetCVQuery(
  //   { file_name },
  //   { skip: !candidateData }
  // );

  const applicationDate = candidateData?.create_at
    ? new Date(candidateData.create_at).toLocaleDateString()
    : "N/A";

  const downloadCV = async () => {
    const response = await axios.get(
      `https://api.hr-infozilion.pitetris.com/v1/mak/recruitment/show/file/${uid}`,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file_name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <Loader type="dots" />;
  }

  if (error) {
    <Text c="red">{`Something went wrong. ${error}`}</Text>;
  }

  return (
    <Box p="md">
      <Title order={3} mb="md">
        Candidate Details
      </Title>

      <Grid>
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} size="lg">
              Profile
            </Text>
            <Divider my="sm" />
            <Text>Name: {candidateData?.name}</Text>
            <Text>Email: {candidateData?.email}</Text>
            <Text>Department: {candidateData?.department}</Text>
            <Text>Application Date: {applicationDate}</Text>
            <Text>
              State:{" "}
              <Badge
                color={candidateData?.state === "pending" ? "yellow" : "green"}
              >
                {candidateData?.state}
              </Badge>
            </Text>
            <Button
              mt={32}
              maw={"160px"}
              onClick={downloadCV}
              c="black"
              variant="outline"
            >
              Download CV
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} size="lg">
              Cover Letter
            </Text>
            <Divider my="sm" />
            <ScrollArea style={{ height: 300 }}>
              <Text>{candidateData?.cover_letter}</Text>
            </ScrollArea>
          </Card>
        </Grid.Col>
      </Grid>

      {/* <Box mt="md" className="flex justify-end">
        <Button variant="default" size="sm" mr="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm" color="red">
          Delete
        </Button>
      </Box> */}
    </Box>
  );
};

export default CandidateDetail;

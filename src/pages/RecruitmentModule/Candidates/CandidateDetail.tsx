import { useParams } from "react-router-dom";
import { useGetCandidateDetailQuery } from "../../../features/api/recruitmentSlice";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Loader,
  ScrollArea,
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
    <p className="text-red-500">{`Something went wrong. ${error}`}</p>;
  }

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <p className="text-lg font-medium">Profile</p>
            <Divider my="sm" />
            <p>Name: {candidateData?.name}</p>
            <p>Email: {candidateData?.email}</p>
            <p>Department: {candidateData?.department}</p>
            <p>Application Date: {applicationDate}</p>
            <p>
              State:{" "}
              <Badge
                color={candidateData?.state === "pending" ? "yellow" : "green"}
              >
                {candidateData?.state}
              </Badge>
            </p>
            <Button
              mt={32}
              maw={"160px"}
              onClick={downloadCV}
              c="black"
              bg="orange"
              variant="outline"
            >
              Download CV
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <p className="text-lg font-medium">Cover Letter</p>
            <Divider my="sm" />
            <ScrollArea style={{ height: 300 }}>
              <p>{candidateData?.cover_letter}</p>
            </ScrollArea>
          </Card>
        </Grid.Col>
      </Grid>

      {/* <div mt="md" className="flex justify-end">
        <Button variant="default" size="sm" mr="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm" color="red">
          Delete
        </Button>
      </div> */}
    </>
  );
};

export default CandidateDetail;

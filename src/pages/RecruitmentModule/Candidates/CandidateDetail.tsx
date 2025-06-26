import { useNavigate, useParams } from "react-router-dom";
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
import { IoMdReturnLeft } from "react-icons/io";

const CandidateDetail = () => {
  const { id: uid } = useParams<{ id?: string }>();
  const {
    data: candidate,
    isLoading,
    error,
  } = useGetCandidateDetailQuery({ uid: uid || "" });
  const navigate = useNavigate();

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
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    <p className="text-red-500">{`Something went wrong. ${error}`}</p>;
  }

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 shadow-md bg-white justify-center gap-1 border border-white/20 text-gray-600 hover:bg-gray-200 rounded py-[4px] text-xs w-[65px]"
      >
        <IoMdReturnLeft size={16} color="gray" />
        Back
      </button>
      <Grid>
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <p className="text-lg font-medium">Profile</p>
            <Divider mb="sm" />
            <p className="text-gray-500">
              Name: <span className="text-blue-700">{candidateData?.name}</span>
            </p>
            <p className="text-gray-500">
              Email:{" "}
              <span className="text-blue-700">{candidateData?.email}</span>
            </p>
            <p className="text-gray-500">
              Department:{" "}
              <span className="text-blue-700">{candidateData?.department}</span>
            </p>
            <p className="text-gray-500">
              Application Date:{" "}
              <span className="text-blue-700">{applicationDate}</span>
            </p>
            <p className="text-gray-500">
              Status:{" "}
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
              c="white"
              bg="orange"
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

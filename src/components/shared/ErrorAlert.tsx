import { Alert } from "@mantine/core";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <Alert title="Error" color="red">
      {message}
    </Alert>
  );
};

export default ErrorAlert;

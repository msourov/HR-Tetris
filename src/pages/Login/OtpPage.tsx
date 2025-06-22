import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextInput, Button, Paper, Container, Loader } from "@mantine/core";
import { useLoginMutation } from "../../features/api/userSlice";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";

interface OtpFormFields {
  otp: number;
}

const OtpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormFields>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: OtpFormFields) => {
    const mobile = localStorage.getItem("mobile");
    const password = localStorage.getItem("password");

    if (!mobile || !password) {
      setError("Phone number or password is missing");
      return;
    }

    try {
      if (mobile && password) {
        const loginData = {
          mobile,
          password,
          otp: data.otp,
        };

        const response = await login(loginData).unwrap();
        if (response.access_token) {
          dispatch(
            setAuth({
              token: response.access_token,
              user: {
                id: response.mobile,
                name: response.name,
              },
            })
          );

          localStorage.removeItem("OtpPending");
          localStorage.removeItem("mobile");
          localStorage.removeItem("password");
          localStorage.setItem("role", JSON.stringify(response?.role));
          localStorage.setItem("userId", response.mobile);
          localStorage.setItem("uid", response.uid);
          localStorage.setItem("name", response.name);

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 50);
        } else {
          setError("OTP verification failed");
        }
      } else {
        console.error("Missing mobile or password");
      }
    } catch (err) {
      const errorResponse = err as {
        data?: { detail?: string };
        status?: number;
      };
      setError(errorResponse?.data?.detail ?? null);
      console.error("OTP verification error:", err);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="OTP"
            placeholder="Enter your OTP"
            required
            {...register("otp", { required: "OTP is required" })}
            error={errors.otp ? errors.otp.message : null}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <Button
            fullWidth
            mt="lg"
            type="submit"
            bg="black"
            className="rounded-lg"
            disabled={isLoading}
          >
            {!isLoading ? (
              "Submit OTP"
            ) : (
              <Loader color="rgba(255, 255, 255, 1)" size={20} />
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default OtpPage;

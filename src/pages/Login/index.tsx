import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextInput,
  PasswordInput,
  Paper,
  Container,
  Button,
  Loader,
  Image,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { MdOutlinePhone } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  mobile: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FromFields = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FromFields>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FromFields) => {
    setLoading(true);
    try {
      const loginCheckRes = await fetch(
        "https://api.hr-infozilion.pitetris.com/v1/mak/role-user/login-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (loginCheckRes.ok) {
        const sendOtpRes = await fetch(
          `https://api.hr-infozilion.pitetris.com/v1/mak/otp/signin?mobile=${encodeURIComponent(
            data.mobile
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile: data.mobile }),
          }
        );

        if (sendOtpRes.ok) {
          localStorage.setItem("mobile", data.mobile);
          localStorage.setItem("password", data.password);
          localStorage.setItem("OtpPending", JSON.stringify(true));
          setLoading(false);
          navigate("otp");
        } else {
          console.error("Failed to send OTP");
          notifications.show({
            title: "Error",
            message: "Failed to send OTP",
            color: "red",
            // autoClose: 2000,
          });
        }
      } else {
        const errorData = await loginCheckRes.json();
        console.log(errorData);
        notifications.show({
          title: "Error",
          message: errorData.detail || "Login check failed",
          color: "red",
          // autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error during login process:", error);
      // console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[url('./assets/loginpage.png')] w-[100vw] h-[100vh] bg-cover fixed top-0 left-0 -z-10 flex items-center justify-center min-h-screen">
      <Container
        // my={120}
        className="text-sm drop-shadow-lg w-full sm:w-[540px] -mt-32"
      >
        <Paper withBorder shadow="md" radius="md">
          <Image
            radius="xs"
            src="/assets/logo.jpg"
            w={220}
            className="mx-auto pt-4"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 sm:px-16 sm:py-10"
          >
            <TextInput
              label="Phone Number"
              placeholder="0123-456-7890"
              autoComplete="no"
              leftSection={<MdOutlinePhone />}
              required
              radius="md"
              {...register("mobile")}
              error={errors.mobile ? errors.mobile.message : null}
            />

            <PasswordInput
              label="Password"
              placeholder="********"
              required
              leftSection={<CiLock />}
              mt="md"
              radius="md"
              {...register("password")}
              error={errors.password ? errors.password.message : null}
            />
            {/* <Group justify="space-between" mt="lg">
              <Anchor
                component="button"
                size="sm"
                c="black"
                fw={600}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Anchor>
            </Group> */}
            <Button
              fullWidth
              mt="lg"
              bg="black"
              type="submit"
              className="rounded-lg"
              disabled={loading}
            >
              {!loading ? (
                "Login"
              ) : (
                <Loader color="rgba(255, 255, 255, 1)" size={20} />
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;

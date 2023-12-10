import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
  const signin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (data) => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const res = await response.json();

        if (res.status == "failed") {
          throw Error("Login failed");
        }
        localStorage.setItem("token", res.data);

        navigate(0);
        return res;
      } catch (err) {
        throw new Error(err as string);
      }
    },
  });

  return (
    <div className="w-screen h-screen grid place-items-center bg-blue-custom">
      <Card>
        <CardHeader>
          <CardTitle>Signin</CardTitle>
        </CardHeader>
        <form onSubmit={signin.handleSubmit}>
          <CardContent className="space-y-2">
            <Input
              placeholder="Email"
              name="email"
              onChange={signin.handleChange}
            />
            <Input
              placeholder="Password"
              name="password"
              onChange={signin.handleChange}
            />
            <br />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Signin;

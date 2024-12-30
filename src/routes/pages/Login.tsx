import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../utils/api";

type FieldValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type BackendErrors = Record<string, string[]>;

const Login = () => {
  const navigate = useNavigate();
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>();

  const onValid: SubmitHandler<FieldValues> = async (data) => {
    setBackendErrors({}); // Clear previous errors
    try {
      const response = await login(data);

      if (response.success) {
        alert("Login successful!");
        navigate("/profile"); // Redirect to the profile page
      } else {
        setBackendErrors(response.errors || {});
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required.",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format." },
          })}
        />
        <p>{errors.email?.message}</p>
        <p>{backendErrors.email?.[0]}</p>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required." })}
        />
        <p>{errors.password?.message}</p>
        <p>{backendErrors.password?.[0]}</p>
      </div>

      <div>
        <label htmlFor="rememberMe">
          <input id="rememberMe" type="checkbox" {...register("rememberMe")} />
          Remember Me
        </label>
      </div>

      <button type="submit">Log in</button>
    </form>
  );
};

export default Login;

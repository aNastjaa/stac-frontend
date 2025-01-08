import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { register } from "../../utils/api";
import { Link } from "react-router";

type FieldValues = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
};

type BackendErrors = Record<string, string[]>;

const Register = () => {
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordRepeatId = useId();
  const navigate = useNavigate();

  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

  const {
    register: registerField,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>();

  const onValid: SubmitHandler<FieldValues> = async (data) => {
    setBackendErrors({}); // Clear previous backend errors

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await register(formData);

      if (response.success) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login page
      } else {
        // Handle backend validation errors
        setBackendErrors(response.errors || {});
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div>
        <label htmlFor={usernameId}>Username</label>
        <input
          id={usernameId}
          type="text"
          placeholder="username"
          {...registerField("username", {
            required: "Username is required.",
            minLength: { value: 3, message: "Must be at least 3 characters." },
          })}
        />
        <p>{errors.username?.message}</p>
        <p>{backendErrors.username?.[0]}</p>
      </div>

      <div>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          placeholder="example@mail.com"
          {...registerField("email", {
            required: "Email is required.",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format." },
          })}
        />
        <p>{errors.email?.message}</p>
        <p>{backendErrors.email?.[0]}</p>
      </div>

      <div>
        <label htmlFor={passwordId}>Password</label>
        <input
          id={passwordId}
          type="password"
          placeholder="password"
          {...registerField("password", {
            required: "Password is required.",
            minLength: { value: 8, message: "Must be at least 8 characters." },
          })}
        />
        <p>{errors.password?.message}</p>
        {backendErrors.password &&
          backendErrors.password.map((err, index) => <p key={index}>{err}</p>)}
      </div>

      <div>
        <label htmlFor={passwordRepeatId}>Repeat Password</label>
        <input
          id={passwordRepeatId}
          type="password"
          placeholder="repeat your password"
          {...registerField("passwordRepeat", {
            required: "Please repeat your password.",
            validate: (value) =>
              value === watch("password") || "Passwords do not match.",
          })}
        />
        <p>{errors.passwordRepeat?.message}</p>
      </div>

      <button type="submit">Register</button>
      <div>
        <p>
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </form>
  );
};

export default Register;

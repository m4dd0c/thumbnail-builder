import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../services/api";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Logic
  const validate = (name: string, value: string): string | undefined => {
    if (!value.trim())
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email";
    if (name === "password" && value.length < 8)
      return "Password must be at least 8 characters";
    return undefined;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      email: validate("email", formData.email),
      password: validate("password", formData.password),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Update auth context
      await login(response.token);

      // Navigate to library page after successful login
      navigate("/library");
    } catch (error) {
      const apiError = error as ApiError;
      setErrors({
        general: apiError.message || "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in bg-gray-50 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[448px] bg-white p-8 border border-gray-300">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-black">
            Login
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Please login to your account
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-sm rounded">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Form Fields */}
          {[
            {
              id: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
            },
            {
              id: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter your password",
            },
          ].map((field) => (
            <div
              key={field.id}
              className="group flex flex-col has-focus:text-black"
            >
              <label
                htmlFor={field.id}
                className="label group-focus-within:text-black"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                className="input"
                placeholder={field.placeholder}
                value={formData[field.id as keyof FormData]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-invalid={!!errors[field.id as keyof FormErrors]}
              />
              {errors[field.id as keyof FormErrors] && (
                <div className="error-message" role="alert">
                  {errors[field.id as keyof FormErrors]}
                </div>
              )}
            </div>
          ))}

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="link text-sm">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="button mt-2"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <span className="relative z-10">
              {isSubmitting ? "Logging in..." : "Login"}
            </span>
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

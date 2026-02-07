import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../services/api";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Logic
  const validate = (name: string, value: string): string | undefined => {
    if (!value.trim())
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (name === "name" && value.trim().length < 2)
      return "Name must be at least 2 characters";
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
      name: validate("name", formData.name),
      email: validate("email", formData.email),
      password: validate("password", formData.password),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Update auth context
      await login(response.token);

      // Navigate to library page after successful registration
      navigate("/library");
    } catch (error) {
      const apiError = error as ApiError;
      setErrors({
        general: apiError.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in bg-gray-50 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[448px] bg-white p-8 border border-gray-300">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-black">
            Register
          </h1>
          <p className="text-sm text-gray-500">
            Create your account to get started
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-sm rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {[
            {
              id: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter your name",
            },
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

          <button
            type="submit"
            className="button mt-2"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <span className="relative z-10">
              {isSubmitting ? "Creating account..." : "Register"}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const FormSchema = z
  .object({
    fullName: z.string().min(1, "Full Name is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    companyName: z.string().min(1, "Company Name is required"),
    password: z
      .string()
      .min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError(""); // Clear previous errors
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          companyName: values.companyName,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setServerError(result.error || "An unexpected error occurred");
      }
    } catch {
      setServerError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#67a5f0] via-[#a0c5f5] to-[#135ced] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#135ced]">
              Create an account
            </h2>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {serverError && (
                <p className="text-red-500 text-center">{serverError}</p>
              )}
              <div className="space-y-2">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  {...form.register("fullName")}
                  id="full-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="societe" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  {...form.register("companyName")}
                  id="societe"
                  type="text"
                  placeholder="Sogea Satom Benin"
                  required
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...form.register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm your password
                </label>
                <div className="relative">
                  <input
                    {...form.register("confirmPassword")}
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                  />
                </div>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
              <button
  type="submit"
  disabled={isLoading} // Disable button when loading
  className={`w-full ${
    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#135ced] hover:bg-[#67a5f0]"
  } text-white-500 font-semibold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center`}
>
  {isLoading ? (
    <div className="flex items-center">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="ml-2">Registering...</span>
    </div>
  ) : (
    "Register"
  )}
</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

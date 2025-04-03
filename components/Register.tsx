"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
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
      if (!response.ok) {
        throw new Error(result.error || 'An error occurred during registration');
      }

      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#67a5f0] via-[#a0c5f5] to-[#135ced] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#135ced]">
              Register
            </h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...form.register('fullName')}
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Company"
                  {...form.register('companyName')}
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
                {form.formState.errors.companyName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register('email')}
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...form.register('password')}
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
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...form.register('confirmPassword')}
                    className="w-full px-3 py-2 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isLoading ? 'bg-gray-400' : 'bg-[#135ced] hover:bg-[#67a5f0]'
                } text-white-500 font-semibold py-3 px-4 rounded-md transition-all duration-300 flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already Have An Account?{' '}
              <a href="/login" className="font-medium text-[#135ced] hover:text-[#67a5f0]">
                Connect Here!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
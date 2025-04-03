'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
});

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
  try {
    const signInData = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: '/dashboard'
    });

    if (!signInData) {
      throw new Error('Aucune réponse du serveur');
    }

    if (signInData.error) {
      let errorMessage = 'Email ou mot de passe incorrect';
      if (signInData.error.includes('CredentialsSignin')) {
        errorMessage = 'Authentification échouée';
      } else if (signInData.error.includes('UserNotFound')) {
        errorMessage = 'Aucun compte associé à cet email';
      }
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } else if (signInData.ok) {
      const callbackUrl = signInData.url || '/dashboard';
      if (callbackUrl.startsWith('/')) {
        router.push(callbackUrl);
      } else {
        router.push('/dashboard');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur inattendue est survenue';
    
    toast({
      title: 'Erreur',
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
            <h2 className="text-3xl font-bold text-center mb-8 text-[#135ced]">Login</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-black-600">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register('email')}
                  className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-black-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...form.register('password')}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#135ced]"
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
              <button
                type="submit"
                className="w-full bg-[#135ced] hover:bg-[#67a5f0] text-white-300 font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center gap-2"
              >
                 {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect!'
                )}
              </button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
               Don&apos;t have an account?{' '}
              <a href="/register" className="font-medium text-[#135ced] hover:text-[#67a5f0]">
                Register Here!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

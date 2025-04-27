/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../lib/schemas/authSchema";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const { signInWithEmail, signInWithGoogle } = useAuth();

  const onSubmit = async (data: SignInForm) => {
    try {
      await signInWithEmail(data.email, data.password);
      toast.success("Signed in successfully!");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed.");
    }
  };

  return (
    <section className="flex justify-center items-center">
      <div className="" />
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 lg:mb-11">
          <span className="text-white text-3xl font-bold">SkillLink</span>
        </div>
        <div className="rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:p-11 p-7 mx-auto">
            <div className="mb-11">
              <h1 className="text-gray-900 text-center text-3xl font-bold leading-10 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-center text-base font-medium leading-6">
                Let's get started with your account
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  className={`w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  className={`w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>


            <Button
              type="submit"
              className="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-indigo-600 shadow-sm !my-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-12 text-gray-700 bg-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-100 transition-all duration-700 border border-gray-300 shadow-sm mb-6 flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-lg" />
              Sign in with Google
            </Button>

            <div className="text-center">
              <p className="text-gray-900 text-base font-medium leading-6">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
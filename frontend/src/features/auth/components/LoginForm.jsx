import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Hexagon,
  CircleDot,
  Settings2,
  Factory,
  Cog,
  Package,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../schema/loginSchema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);

      console.log("LOGIN SUCCESS");

      toast.success("Login Successful");

      navigate("/dashboard");

      console.log("NAVIGATED TO DASHBOARD");
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Invalid username or password"
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white lg:grid lg:grid-cols-[52%_48%]">

      {/* =====================================================
          LEFT INDUSTRIAL BRANDING PANEL
      ===================================================== */}

      <div className="relative hidden min-h-screen overflow-hidden bg-[#090b0d] lg:block">

        {/* Industrial honeycomb-style background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 20%, rgba(255,102,0,0.14), transparent 28%),
              radial-gradient(circle at 80% 75%, rgba(255,102,0,0.08), transparent 30%),
              repeating-linear-gradient(
                60deg,
                rgba(255,255,255,0.025) 0px,
                rgba(255,255,255,0.025) 1px,
                transparent 1px,
                transparent 28px
              ),
              repeating-linear-gradient(
                -60deg,
                rgba(255,255,255,0.025) 0px,
                rgba(255,255,255,0.025) 1px,
                transparent 1px,
                transparent 28px
              )
            `,
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0b0d0f]/90 to-[#121416]" />

        {/* Orange top-left corner */}
        <div className="absolute -left-20 -top-20 h-56 w-56 rotate-45 border-b-[10px] border-r-[10px] border-orange-500/90" />

        {/* Orange top-right accent */}
        <div className="absolute right-[-100px] top-[-90px] h-64 w-64 rotate-45 border-b-[8px] border-l-[8px] border-orange-500/90" />

        {/* Large decorative hexagon */}
        <div className="absolute bottom-[-100px] right-[-70px] h-[430px] w-[430px] rotate-45 border-[35px] border-[#202326] opacity-80" />

        <div className="absolute bottom-[-50px] right-[-20px] h-[300px] w-[300px] rotate-45 border-[20px] border-[#171a1d] opacity-90" />

        {/* Main content */}
        <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-16">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3">

              <img src="/images/logo.png" alt="Fareni Logo" className="w-full max-w-md object-contain translate-x-21" />

            </div>

          </div>

          {/* CENTER CONTENT */}
          <div className="max-w-xl">

            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] w-14 bg-orange-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                Industrial ERP
              </span>
            </div>

            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl">
              Industrial Business
              <span className="block text-orange-500">
                Management System
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
              Streamline your operations. Control your
              inventory. Manage sales, purchases and
              grow your business with one powerful ERP.
            </p>

            {/* FEATURE ITEMS */}
            <div className="mt-12 grid grid-cols-4 border-y border-white/10 py-6">

              <div className="flex flex-col items-center border-r border-orange-500/60 px-3 text-center">
                <Hexagon className="mb-3 h-8 w-8 text-white" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-300">
                  FASTENERS
                </span>
              </div>

              <div className="flex flex-col items-center border-r border-orange-500/60 px-3 text-center">
                <CircleDot className="mb-3 h-8 w-8 text-white" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-300">
                  SEALING
                </span>
              </div>

              <div className="flex flex-col items-center border-r border-orange-500/60 px-3 text-center">
                <Settings2 className="mb-3 h-8 w-8 text-white" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-300">
                  INDUSTRIAL
                </span>
              </div>

              <div className="flex flex-col items-center px-3 text-center">
                <ShieldCheck className="mb-3 h-8 w-8 text-white" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-300">
                  RELIABLE
                </span>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">
                FIS
              </span>

              <span className="text-sm font-medium tracking-[0.25em] text-gray-500">
                ERP
              </span>
            </div>

            <div className="h-[2px] w-20 bg-orange-500" />

          </div>

        </div>
      </div>


      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-10 sm:px-10 lg:px-14 xl:px-20">

        {/* Mobile branding */}
        <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center bg-[#111315]">
            <span className="font-black text-orange-500">
              F
            </span>
          </div>

          <div>
            <p className="font-black tracking-widest text-gray-900">
              FARENI
            </p>

            <p className="text-[8px] font-semibold tracking-widest text-gray-500">
              INDUSTRIAL SOLUTIONS
            </p>
          </div>
        </div>

        {/* Top right ERP branding */}
        <div className="absolute right-8 top-8 hidden items-center gap-4 lg:flex">
          <span className="text-xl font-black tracking-tight text-[#111315]">
            FIS
            <span className="ml-1 font-normal text-gray-500">
              ERP
            </span>
          </span>

          <div className="h-[3px] w-9 bg-orange-500" />
        </div>


        {/* LOGIN CONTENT */}
        <div className="w-full max-w-xl">

          {/* Heading */}
          <div className="mb-9">

            <div className="mb-6 h-[3px] w-12 bg-orange-500" />

            <h2 className="text-4xl font-bold tracking-tight text-[#111315] sm:text-5xl">
              Welcome back
            </h2>

            <p className="mt-3 text-base text-slate-500">
              Sign in to your Fareni Industrial Solutions
              account
            </p>

          </div>


          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* USERNAME */}
            <div>

              <div className="relative">

                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <Input
                  {...register("username")}
                  type="text"
                  placeholder="Email or Username"
                  className="
                    h-14
                    rounded-md
                    border-slate-300
                    bg-white
                    pl-12
                    text-base
                    shadow-sm
                    transition
                    placeholder:text-slate-400
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />

              </div>

              {errors.username && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}

            </div>


            {/* PASSWORD */}
            <div>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <Input
                  {...register("password")}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  className="
                    h-14
                    rounded-md
                    border-slate-300
                    bg-white
                    pl-12
                    pr-12
                    text-base
                    shadow-sm
                    transition
                    placeholder:text-slate-400
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    transition
                    hover:text-orange-500
                  "
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>


            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex cursor-pointer items-center gap-3 text-slate-700">

                <input
                  type="checkbox"
                  className="
                    h-5
                    w-5
                    cursor-pointer
                    rounded
                    border-slate-300
                    accent-orange-500
                  "
                />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="
                  font-medium
                  text-orange-500
                  transition
                  hover:text-orange-600
                  hover:underline
                "
              >
                Forgot password?
              </button>

            </div>


            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-md
                bg-orange-500
                text-base
                font-semibold
                text-white
                shadow-lg
                shadow-orange-500/20
                transition-all
                duration-200
                hover:bg-orange-600
                hover:shadow-xl
                hover:shadow-orange-500/25
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isSubmitting
                ? "Signing In..."
                : "Sign In"}

              {!isSubmitting && (
                <ArrowRight
                  className="
                    h-5
                    w-5
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              )}
            </button>

          </form>


          {/* SECURITY */}
          <div className="mt-12 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="h-4 w-4" />
              <span>
                Secure access to your ERP
              </span>
            </div>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

        </div>
      </div>

    </div>
  );
}
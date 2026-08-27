import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        // try {
        //     await login(data);

        //     toast.success("Login Successful");

        //     navigate("/dashboard");
        // } catch (error) {
        //     toast.error(
        //     error?.response?.data?.message ||
        //     "Invalid username or password"
        //     );
        // }
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
        <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur">
        <CardContent className="p-8">
            <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
                BoltERP
            </h1>

            <p className="mt-2 text-muted-foreground">
                Business Management Suite
            </p>
            </div>

            <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            >
            {/* Email */}

            <div>
                <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                    {...register("username")}
                    type="text"
                    placeholder="Username"
                    className="h-11 pl-10"
                />
                </div>

                {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                </p>
                )}
            </div>

            {/* Password */}

            <div>
                <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-11 pl-10 pr-10"
                />

                <button
                    type="button"
                    onClick={() =>
                    setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-3"
                >
                    {showPassword ? (
                    <EyeOff size={18} />
                    ) : (
                    <Eye size={18} />
                    )}
                </button>
                </div>

                {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                </p>
                )}
            </div>

            {/* Remember Me */}

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
                </label>

                <button
                type="button"
                className="text-primary hover:underline"
                >
                Forgot Password?
                </button>
            </div>

            {/* Submit Button */}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full"
            >
                {isSubmitting
                ? "Signing In..."
                : "Sign In"}
            </Button>
            </form>
        </CardContent>
        </Card>
    );
    }
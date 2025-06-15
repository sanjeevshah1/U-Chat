import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../Components/AuthImagePattern";
import api from "../utils/axios";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be at most 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const signUpSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email("Must be a valid email"),
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const { setAccessToken } = useAuthStore();

  interface FormType {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<FormType>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate formData with Zod schema
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      // Extract errors from ZodError and display or handle them
      const formattedError = result.error.issues.map((err) => {
        const cleanedPath =
          err.path[0] === "body"
            ? err.path.slice(1).join(".")
            : err.path.join(".");
        return {
          path: cleanedPath,
          message: err.message,
        };
      });

      // You can log or display these errors as needed
      console.log(formattedError);
      formattedError.forEach(({ message }) => toast.error(message));

      return; // Stop here if validation failed
    }

    // If validation passes, proceed with signup request
    setIsSigning(true);

    try {
      const response = await api.post("/auth/signup", formData);

      if (response.data.success) {
        toast.success("Account created successfully!");
        setFormData({
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAccessToken(response.data.accessToken, response.data.userId);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response: unknown }).response === "object"
      ) {
        const safeError = error as {
          response: {
            data?: {
              errors?: { path: string; message: string }[];
              message?: string;
            };
          };
          message?: string;
        };

        const validationErrors = safeError.response?.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          validationErrors.forEach(({ message }, index) => {
            setTimeout(() => {
              toast.error(message);
            }, index * 100);
          });
        } else {
          toast.error(
            safeError.response?.data?.message ||
              safeError.message ||
              "Something went wrong"
          );
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSigning(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 33, text: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 66, text: "Fair", color: "bg-yellow-500" };
    return { strength: 100, text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="grid md:grid-cols-2  h-[calc(100vh-5rem)] border-t-1 border-white/20 ">
      {/* Left side - Form */}
      <div className="flex flex-col pt-6 justify-center items-center bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-3 sm:p-4 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-xl">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2  text-white" />
                </div>
              </div>
              <div className="">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create your account in few seconds
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-xl shadow-lg p-8 lg:p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="w-full mt-2 pl-10 pr-4 py-2.5 sm:py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    className="w-full mt-2 pl-10 pr-4 py-2.5 sm:py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 mt-2 py-2.5 sm:py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-medium min-w-fit ${
                          passwordStrength.text === "Weak"
                            ? "text-red-500"
                            : passwordStrength.text === "Fair"
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 mt-2 pr-16 py-2.5 sm:py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <div className="absolute inset-y-0 right-12 flex items-center">
                    {formData.confirmPassword &&
                      (formData.password === formData.confirmPassword ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-red-500 bg-red-50"></div>
                      ))}
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="text-xs font-medium">
                    {formData.password === formData.confirmPassword ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-50"></div>
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 px-1 sm:px-0">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  disabled={isSigning}
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-sm sm:text-base text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                >
                  Sign in now →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image Pattern */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;

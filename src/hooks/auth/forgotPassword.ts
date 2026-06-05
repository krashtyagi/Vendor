// import React from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   ResetPasswordProps,
//   ResetPasswordSchema,
//   type SignUpProps,
//   SignUpSchema,
// } from "@/schema/auth";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useCurrentUser } from "@/services/queryes";
// import { useAuthStore } from "@/stores/auth.store";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// export const useResetPassword = () => {
//   const [loading, setLoading] = React.useState<boolean>(false);
//   const navigate = useRouter();
//   const { forgotPassword, verifyForgotPasswordOTP, resetPassword } =
//     useAuthStore();

//   const methods = useForm<ResetPasswordProps>({
//     resolver: zodResolver(ResetPasswordSchema),
//     defaultValues: {
//       phone: "",
//       otp: "",
//       password: "",
//       confirmPassword: "",
//     },
//     mode: "onChange",
//   });
//   const { refetch } = useCurrentUser();

//   const onHandleSubmit = methods.handleSubmit(async (data) => {
//     setLoading(true);
//     try {
//       const result = await resetPassword({
//         phone: data.phone,
//         otp: data.otp,
//         newPassword: data.password,
//       });
//       if (result.success) {
//         toast.success(result.message || "password reset successfully");
//         RouterPush(navigate, "/");
//       } else {
//         toast.error(result.message || "Failed to reset password");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   });

//   const onVerify = async (
//     phone: string,
//     otp: string,
//     onNext: React.Dispatch<React.SetStateAction<number>>,
//   ) => {
//     setLoading(true);

//     try {
//       const result = await verifyForgotPasswordOTP({
//         phone: phone,
//         otp: otp,
//         endpoint: "/auth/otp-verify",
//       });
//       if (result.success) {
//         console.log(result);

//         onNext((prev) => prev + 1);
//         toast.success(result.message || "OTP verified successfully");
//       } else {
//         console.log(result, "failes");

//         toast.error(result.message || "Failed to verify OTP");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onGenerateOtp = async (
//     phone: string,

//     onNext: React.Dispatch<React.SetStateAction<number>>,
//   ) => {
//     setLoading(true);
//     try {
//       const result = await forgotPassword({
//         phone,
//       });
//       if (result.success) {
//         toast.success(result.message || "OTP sent to your email");
//         onNext((prev) => prev + 1);
//       } else {
//         toast.error(result.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     methods,
//     onHandleSubmit,
//     onVerify,
//     onGenerateOtp,
//   };
// };
// function RouterPush(navigate: AppRouterInstance, arg1: string) {
//   throw new Error("Function not implemented.");
// }


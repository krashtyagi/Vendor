// 'use client';

// import { useRouter } from "next/navigation";
// import { useCurrentUser } from "@/services/queryes";
// import { useProcessContext } from "@/context/auth/ProcessContextProvider";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2 } from "lucide-react";
// import { Step_1 } from "../_components/step-1";
// import { Step_2 } from "../_components/step-2";
// import { Step_3 } from "../_components/step-3";

// interface FullProcessFormProps {
//   methods: any;
//   currentStep: number;
// }

// export default function FullProcessForm({ methods, currentStep }: FullProcessFormProps) {
//   const router = useRouter();
//   const { data: u } = useCurrentUser();

//   switch (currentStep) {
//     case 2:
//       return <Step_1 currentStep={currentStep} methods={methods} />;
//     case 3:
//       return <Step_2 currentStep={currentStep} methods={methods} />;
//     case 4:
//       return <Step_3 currentStep={currentStep} methods={methods} />;
//     case 5:
//       return (
//         <div className="py-12 text-center">
//           <h1 className="text-xl font-bold text-destructive">
//             Application {u?.data?.data?.vendor?.status}
//           </h1>
//           <p className="text-muted-foreground mt-2">Please contact support for more details.</p>
//           <Button
//             variant="outline"
//             className="w-full sm:w-auto mt-4"
//             onClick={() => router.push("/login")}
//           >
//             Return to Login
//           </Button>
//         </div>
//       );
//     default:
//       return (
//         <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
//           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
//             <CheckCircle2 className="w-8 h-8 text-primary" />
//           </div>
//           <h1 className="text-2xl font-bold tracking-tight mb-2">Your account is under review</h1>
//           <p className="text-muted-foreground max-w-[300px] mb-8">
//             Our team is verifying your business details. We'll notify you via email shortly.
//           </p>
//           <Button
//             variant="outline"
//             className="w-full sm:w-auto"
//             onClick={() => {
//               if (typeof window !== "undefined") {
//                 localStorage.clear();
//                 router.push("/login");
//               }
//             }}
//           >
//             Return to Login
//           </Button>
//         </div>
//       );
//   }
// }
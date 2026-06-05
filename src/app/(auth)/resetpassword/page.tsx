

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        {/* <ResetPasswordContextProvider>

        <ResetPassword  />
        </ResetPasswordContextProvider> */}
        </div>
  )
}

export default page


// export function ResetPassword({  className }: {
//   className?: string
// }) {
//   const { currentStep, setCurrentStep } = useResetPasswordForm();
//   const { loading, methods, onHandleSubmit } = useResetPassword();
//   const [onOTP, setOnOTP] = React.useState<string>("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   return (
//     <Form {...methods}>
//       <form onSubmit={onHandleSubmit}>
//         <Loader loading={loading}>
//           <div className={cn("flex flex-col", className)} >
//             {currentStep === 1 && (
//               <div className={cn("flex flex-col   ", className)} >
//                 <div className="flex flex-col items-center gap-2 text-center mt-5">
//                   <a
//                     href="#"
//                     className="flex flex-col items-center gap-2 font-medium"
//                   >
//                     <div className="flex  items-center justify-center rounded-md">
//                       <LOGO />
//                     </div>
//                     <span className="sr-only">Hilexa </span>
//                   </a>
//                   <h1 className="text-xl font-bold">Welcome to Hilexa</h1>
//                   {/* <p>
//                     Don&apos;t have an account? <a href="/signup">Sign up</a>
//                   </p> */}
//                 </div>

//                 <FieldGroup className="p-5 px-10">
//                   <Field>
//                     <FormField
//                       control={methods.control}
//                       name="phone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone</FormLabel>
//                           <FormControl>
//                             <Input
//                               className="rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                               id="phone"
//                               type="number"
//                               placeholder="Enter your phone"
//                               disabled={loading}
//                               {...field}


//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </Field>

//                   <Field>
//                     <ForgetPasswordHandeler
//                       currentStep={currentStep}
//                       setCurrentStep={setCurrentStep}
//                     />
//                   </Field>
//                   {/* <FieldSeparator>Or</FieldSeparator>
//                   <Field className="grid gap-2 sm:grid-cols-1 md:px-10">
//                     {ConnectWithMedia.map((item, i) => (
//                       <Button
//                         variant="outline"
//                         type="button"
//                         key={i}
//                         onClick={() => {
//                           window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1${item.url}`;
//                         }}
//                       >
//                         {item.icon}
//                         Continue with {item.title}
//                       </Button>
//                     ))}
//                   </Field> */}
//                 </FieldGroup>
//                 {/* <div className="flex flex-col items-center gap-2 text-center  md:hidden">
//                   <FieldDescription>
//                     Already have an account? <a href="/login" className="text-primary font-bold cursor-pointer">Back to Login</a>
//                   </FieldDescription>
//                 </div> */}
//                 <div className="flex flex-col items-center gap-2 text-center   font-bold text-primary">
//                   <FieldDescription>
//                     Already have an account? <span onClick={() => setTag("Log-in")} className="text-primary font-bold cursor-pointer">Back to Login</span>
//                   </FieldDescription>
//                 </div>
//                 <br />

//                 <FieldDescription className="px-6 text-center">
//                   By clicking continue, you agree to our{" "}
//                   <a href="#">Terms of Service</a> and{" "}
//                   <a href="#">Privacy Policy</a>.
//                 </FieldDescription>

//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="w-full flex justify-center">
//               <ForgotPasswordOTPForm className="bg-transparent w-full" methods={methods} onOTP={onOTP} setOnOTP={setOnOTP} />
//               </div>
              
//             )}
//             {
//               currentStep == 3 && (
//                 <div className="flex flex-col gap-3 justify-center m-10">
//                   <Field>
//                     <FormField
//                       control={methods.control}
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Password</FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 className="rounded-full pr-12" // pr-12 gives space so text doesn't go under the icon
//                                 id="password"
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Enter your password"
//                                 disabled={loading}
//                                 {...field}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                               >
//                                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                               </button>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </Field>

//                   <Field>
//                     <FormField
//                       control={methods.control}
//                       name="confirmPassword"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Confirm Password</FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 className="rounded-full pr-12"
//                                 id="confirmPassword"
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 placeholder="Confirm Password"
//                                 disabled={loading}
//                                 {...field}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                               >
//                                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                               </button>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </Field>

//                   <Field>
//                     <ForgetPasswordHandeler
//                       currentStep={currentStep}
//                       setCurrentStep={setCurrentStep}
//                     />
//                   </Field>
//                 </div>

//               )
//             }
//           </div>
//         </Loader>
//       </form>
//     </Form>
//   );
// }
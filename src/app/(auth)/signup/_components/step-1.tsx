// "use client";

// import { useState, useRef } from "react";
// import { useFormContext, UseFormReturn } from "react-hook-form";
// import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Field, FieldLabel, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
// import LOGO from "@/components/logo/logo";
// import { serviceTypeEnumProps, SignUpProps } from "@/schema/auth";
// import { cn } from "@/lib/utils";
// import { SelectContent, Select, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
// import ImageField from "./image-input";
// import { useAuthStore } from "@/stores/auth.store";


// interface UploadedFile {
//   url: string;
//   public_id: string;
//   resource_type: string;
// }


// export const Step_1 = ({
//   currentStep,
//   methods,
// }: {
//   currentStep: number;
//   methods: UseFormReturn<SignUpProps>;
// }) => {
//   const {
//     register,
//     formState: { errors },
//     watch,
//   } = methods;
//   return (
//     <FieldGroup className="space-y-6">


//       <div className="flex flex-col  gap-6">
//         <Field>
//           <FieldLabel>serviceType</FieldLabel>
//           <Select
//             onValueChange={(value) => methods.setValue("serviceType", value as serviceTypeEnumProps)}
//             defaultValue="hotel"
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select service type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="hotel">Hotel</SelectItem>
//               <SelectItem value="restaurant">Restaurant</SelectItem>
//               <SelectItem value="cafe">Cafe</SelectItem>

//             </SelectContent>
//           </Select>
//           {errors.serviceType && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.serviceType.message}
//             </p>
//           )}
//         </Field>

//         {/* Business Name */}
//         <Field className="md:col-span-2">
//           <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
//           <Input
//             id="businessName"
//             type="text"
//             placeholder="Business Name"
//             {...register("businessName")}
//             className={cn(errors.businessName && "border-destructive")}
//           />
//           {errors.businessName && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.businessName.message}
//             </p>
//           )}
//         </Field>

//         {/* Email */}
//         <Field className="md:col-span-2">
//           <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
//           <Input
//             id="businessEmail"
//             type="email"
//             placeholder="Business Email"
//             {...register("businessEmail")}
//             className={cn(errors.businessEmail && "border-destructive")}
//           />
//           {errors.businessEmail && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.businessEmail.message}
//             </p>
//           )}
//         </Field>

//         {/* Phone Number */}
//         <Field>
//           <FieldLabel htmlFor="businessPhone">Business Phone Number</FieldLabel>
//           <Input
//             id="businessPhone"
//             type="tel"
//             placeholder="9876543210"
//             {...register("businessPhone")}
//             className={cn(errors.businessPhone && "border-destructive")}
//           />
//           {errors.businessPhone && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.businessPhone.message}
//             </p>
//           )}
//         </Field>

//         {/* Address - Full Width */}
//         <Field className="md:col-span-2">
//           <FieldLabel htmlFor="businessAddress">Business Address</FieldLabel>
//           <Input
//             id="businessAddress"
//             placeholder="MG Road, Bangalore"
//             {...register("businessAddress")}
//             className={cn(errors.businessAddress && "border-destructive")}
//           />
//           {errors.businessAddress && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.businessAddress.message}
//             </p>
//           )}
//         </Field>
//         {/* city */}
//         <Field>
//           <FieldLabel htmlFor="city">City</FieldLabel>
//           <Input
//             id="city"
//             placeholder="Bangalore"
//             {...register("city")}
//             className={cn(errors.city && "border-destructive")}
//           />
//           {errors.city && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.city.message}
//             </p>
//           )}
//         </Field>
//         {/* state */}
//         <Field>
//           <FieldLabel htmlFor="state">State</FieldLabel>
//           <Input
//             id="state"
//             placeholder="Karnataka"
//             {...register("state")}
//             className={cn(errors.state && "border-destructive")}
//           />
//           {errors.state && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.state.message}
//             </p>
//           )}
//         </Field>
//         {/* Country */}
//         <Field>
//           <FieldLabel htmlFor="country">Country</FieldLabel>
//           <Input
//             id="country"
//             placeholder="India"
//             {...register("country")}
//             className={cn(errors.country && "border-destructive")}
//           />
//           {errors.country && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.country.message}
//             </p>
//           )}
//         </Field>
//         {/* pan Number */}
//         <Field>
//           <FieldLabel htmlFor="panNumber">PAN Number</FieldLabel>
//           <Input
//             id="panNumber"
//             type="text"
//             placeholder="ABCDE1234F"
//             {...register("panNumber")}
//             className={cn(errors.panNumber && "border-destructive")}
//           />
//           {errors.panNumber && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.panNumber.message}
//             </p>
//           )}
//         </Field>
//         {/* adhar Number */}
//         <Field>
//           <FieldLabel htmlFor="aadhaarNumber">Aadhaar Number</FieldLabel>
//           <Input
//             id="aadhaarNumber"
//             type="tel"
//             placeholder="1234 5678 9012"
//             {...register("aadhaarNumber")}
//             className={cn(errors.aadhaarNumber && "border-destructive")}
//           />
//           {errors.aadhaarNumber && (
//             <p className="text-sm text-destructive mt-1">
//               {errors.aadhaarNumber.message}
//             </p>
//           )}
//         </Field>
//         <ImageField
//           label="PanCard"
//           docName="panCard"
//           onUploadSuccess={(data) => {
//             const docs = watch("verificationDocs") || [];
//             methods.setValue("verificationDocs", [...docs, { docName: data.name, docUrl: data.url }], { shouldValidate: true });
//           }}
//         />
//         <ImageField
//           label="aadhaarFront"
//           docName="aadhaarFront"
//           onUploadSuccess={(data) => {
//             const docs = watch("verificationDocs") || [];
//             methods.setValue("verificationDocs", [...docs, { docName: data.name, docUrl: data.url }], { shouldValidate: true });
//           }}
//         />





//       </div>
//     </FieldGroup>
//   )
// }

"use client";

import { useFormContext, UseFormReturn } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { serviceTypeEnumProps, SignUpProps } from "@/schema/auth";
import ImageField from "./image-input";

export const Step_1 = ({
  methods,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  return (
    <FieldGroup className="space-y-8 animate-in fade-in duration-500">
      {/* Business Identity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field className="md:col-span-1">
          <FieldLabel>Service Type</FieldLabel>
          <Select
            onValueChange={(value) => setValue("serviceType", value as serviceTypeEnumProps)}
            defaultValue="hotel"
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotel">Hotel</SelectItem>
              {/* <SelectItem value="cab">Cab</SelectItem> */}
              <SelectItem value="tour">Tour</SelectItem>
              {/* <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem> */}
            </SelectContent>
          </Select>
          {errors.serviceType && <p className="text-xs font-medium text-destructive mt-1.5">{errors.serviceType.message}</p>}
        </Field>

        <Field className="md:col-span-1">
          <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
          <Input
            id="businessName"
            placeholder="e.g. Grand Plaza"
            {...register("businessName")}
            className={cn("h-11", errors.businessName && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.businessName && <p className="text-xs font-medium text-destructive mt-1.5">{errors.businessName.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
          <Input
            id="businessEmail"
            type="email"
            placeholder="contact@business.com"
            {...register("businessEmail")}
            className={cn("h-11", errors.businessEmail && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.businessEmail && <p className="text-xs font-medium text-destructive mt-1.5">{errors.businessEmail.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="businessPhone">Business Phone</FieldLabel>
          <Input
            id="businessPhone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("businessPhone")}
            className={cn("h-11", errors.businessPhone && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.businessPhone && <p className="text-xs font-medium text-destructive mt-1.5">{errors.businessPhone.message}</p>}
        </Field>
      </div>

      <hr className="border-border" />

      {/* Location Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field className="md:col-span-3">
          <FieldLabel htmlFor="businessAddress">Full Address</FieldLabel>
          <Input
            id="businessAddress"
            placeholder="Street, Landmark..."
            {...register("businessAddress")}
            className={cn("h-11", errors.businessAddress && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.businessAddress && <p className="text-xs font-medium text-destructive mt-1.5">{errors.businessAddress.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" placeholder="Bangalore" {...register("city")} className="h-11" />
        </Field>

        <Field>
          <FieldLabel htmlFor="state">State</FieldLabel>
          <Input id="state" placeholder="Karnataka" {...register("state")} className="h-11" />
        </Field>

        <Field>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <Input id="country" placeholder="India" {...register("country")} className="h-11" />
        </Field>
      </div>

      <hr className="border-border" />

      {/* Verification Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Legal Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="panNumber">PAN Number</FieldLabel>
            <Input id="panNumber" placeholder="ABCDE1234F" {...register("panNumber")} className="h-11 uppercase" />
            {errors.panNumber && <p className="text-xs font-medium text-destructive mt-1.5">{errors.panNumber.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="aadhaarNumber">Aadhaar Number</FieldLabel>
            <Input id="aadhaarNumber" placeholder="1234 5678 9012" {...register("aadhaarNumber")} className="h-11" />
            {errors.aadhaarNumber && <p className="text-xs font-medium text-destructive mt-1.5">{errors.aadhaarNumber.message}</p>}
          </Field>
        </div>

        {/* Improved Document Upload Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <ImageField
            label="Upload PAN Card"
            docName="panCard"
            onUploadSuccess={(data) => {
              const docs = watch("verificationDocs") || [];
              const updatedDocs = docs.some((d: any) => d.docName === data.name)
                ? docs.map((d: any) => d.docName === data.name ? { ...d, docUrl: data.url } : d)
                : [...docs, { docName: data.name, docUrl: data.url }];
              setValue("verificationDocs", updatedDocs, { shouldValidate: true });
            }}
          />
          <ImageField
            label="Aadhaar Front Side"
            docName="aadhaarFront"
            onUploadSuccess={(data) => {
              const docs = watch("verificationDocs") || [];
              const updatedDocs = docs.some((d: any) => d.docName === data.name)
                ? docs.map((d: any) => d.docName === data.name ? { ...d, docUrl: data.url } : d)
                : [...docs, { docName: data.name, docUrl: data.url }];
              setValue("verificationDocs", updatedDocs, { shouldValidate: true });
            }}
          />
        </div>
      </div>
    </FieldGroup>
  );
};
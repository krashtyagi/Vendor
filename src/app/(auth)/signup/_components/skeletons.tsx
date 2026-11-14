import React from "react";

export const SignupSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Title block */}
      <div className="space-y-2">
        <div className="h-5 w-32 bg-white/10 rounded-full" />
        <div className="h-8 w-60 bg-white/15 rounded-xl" />
        <div className="h-3.5 w-72 bg-white/10 rounded-md" />
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-24 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/5 border border-white/10 rounded-full" />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="h-12 w-full bg-gradient-to-r from-emerald-600/40 to-pink-500/40 rounded-full mt-4" />
    </div>
  );
};

export const OtpSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse text-center">
      {/* Header */}
      <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center">
        <div className="w-6 h-6 bg-emerald-500/30 rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="h-7 w-52 bg-white/15 rounded-lg mx-auto" />
        <div className="h-4 w-72 bg-white/10 rounded mx-auto" />
      </div>

      {/* 4 OTP boxes */}
      <div className="flex justify-center gap-3 py-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-13 h-14 bg-white/5 border border-white/15 rounded-xl"
          />
        ))}
      </div>

      {/* Action button */}
      <div className="h-12 w-full bg-white/10 rounded-full" />
    </div>
  );
};

export const Step1Skeleton = () => {
  return (
    <div className="space-y-8 animate-pulse text-white">
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30" />
          <div className="space-y-1">
            <div className="h-5 w-52 bg-white/15 rounded-lg" />
            <div className="h-3.5 w-72 bg-white/10 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>

      {/* Grid for Business Identity Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3.5 w-28 bg-white/10 rounded" />
            <div className="h-11 w-full bg-white/5 border border-white/10 rounded-xl" />
          </div>
        ))}
      </div>

      <hr className="border-white/10" />

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-36 bg-white/15 rounded" />
            <div className="h-3 w-56 bg-white/10 rounded" />
          </div>
          <div className="h-8 w-36 bg-white/10 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-2">
            <div className="h-3.5 w-24 bg-white/10 rounded" />
            <div className="h-11 w-full bg-white/5 border border-white/10 rounded-xl" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-20 bg-white/10 rounded" />
              <div className="h-11 w-full bg-white/5 border border-white/10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Legal Verification Section */}
      <div className="space-y-4">
        <div className="h-4 w-36 bg-white/15 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-28 bg-white/10 rounded" />
              <div className="h-11 w-full bg-white/5 border border-white/10 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Upload boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-[130px] w-full bg-white/5 border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="h-3 w-32 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Step2Skeleton = () => {
  return (
    <div className="space-y-8 animate-pulse text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30" />
          <div className="space-y-1">
            <div className="h-5 w-60 bg-white/15 rounded-lg" />
            <div className="h-3.5 w-80 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Section 1: Account Holder & Bank Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3.5 w-36 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Section 2: Numbers & Routing box */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-32 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-28 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Bank Proof Upload */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="h-4 w-44 bg-white/15 rounded" />
          <div className="h-3 w-72 bg-white/10 rounded" />
        </div>
        <div className="max-w-md">
          <div className="h-[130px] w-full bg-white/5 border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="h-3 w-36 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Step3Skeleton = () => {
  return (
    <div className="space-y-8 animate-pulse text-white">
      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="h-3.5 w-24 bg-white/10 rounded" />
          <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-28 bg-white/10 rounded" />
          <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3.5 w-20 bg-white/10 rounded" />
        <div className="h-24 w-full bg-white/5 border border-white/10 rounded-xl" />
      </div>

      {/* Amenities Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 bg-white/15 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/10 rounded-xl h-11"
            >
              <div className="w-4 h-4 bg-white/15 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Gallery images */}
      <div className="space-y-3">
        <div className="h-4 w-36 bg-white/15 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="aspect-square w-full bg-white/5 border border-white/10 rounded-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ReviewSkeleton = () => {
  return (
    <div className="py-12 flex flex-col items-center text-center animate-pulse space-y-4 text-white">
      <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center" />
      <div className="h-6 w-64 bg-white/15 rounded-lg" />
      <div className="h-4 w-80 bg-white/10 rounded" />
      <div className="h-10 w-36 bg-white/10 rounded-full mt-4" />
    </div>
  );
};

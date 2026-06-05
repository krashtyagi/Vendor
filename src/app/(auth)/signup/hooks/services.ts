import { axiosApi } from "@/lib/axios";
import { serviceTypeEnumProps, SignUpProps } from "@/schema/auth";

export const businessDetails = async ({
  serviceType,
  businessName,
  businessEmail,
  businessPhone,
  businessAddress,
  city,
  state,
  country,
  panNumber,
  aadhaarNumber,
  verificationDocs,
}: {
  serviceType: serviceTypeEnumProps;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  panNumber: string;
  aadhaarNumber: string;
  verificationDocs: { docName: string; docUrl: string }[];
}) => {
  const res = await axiosApi.post("/vendors/register", {
    serviceType,
    businessName,
    businessEmail,
    businessPhone,
    businessAddress,
    city,
    state,
    country,
    panNumber,
    aadhaarNumber,
    verificationDocs,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const BankDetails = async ({
  bankName,
  accountNumber,
  ifscCode,
  branchName,
  accountHolderName,
  bankProof,
}: {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  bankProof: { url: string; public_id: string; resource_type: string };
}) => {
  const res = await axiosApi.post("/vendor-bank", {
    bankName,
    accountNumber,
    ifscCode,
    branchName,
    accountHolderName,
    bankProof,
  });

  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const SaveHotelDetails = async ({
  name,
  address,
  description,
  amenities,
  documents,
  images,
  city,
  location,
}: {
  name: string;
  address: string;
  description: string;
  amenities: string[];
  documents: {
    docName: string;
    docUrl: string;
    public_id: string;
    resource_type: string;
  }[];
  images: { url: string; public_id: string; resource_type: string }[];
  city: string;
  location: { type: string; coordinates: [number, number] };
}) => {
  const res = await axiosApi.post("/vendors/hotels", {
    name,
    address,
    description,
    amenities,
    documents,
    images,
    city,
    location,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const SaveCabDetails = async ({
  name,
  address,
  description,
  features,
  documents,
  images,
  location,
  coordinates,
}: {
  name: string;
  address: string;
  description: string;
  features: string[];
  documents: any[];
  images: any[];
  location: { city: string; state: string; country: string };
  coordinates: { lat: number; lng: number };
}) => {
  const res = await axiosApi.post("/cabs/vendor/cabs", {
    name,
    address,
    description,
    features,
    documents,
    images,
    location,
    coordinates,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const SaveBikeDetails = async ({
  name,
  address,
  description,
  features,
  documents,
  images,
  location,
  coordinates,
}: {
  name: string;
  address: string;
  description: string;
  features: string[];
  documents: any[];
  images: any[];
  location: { city: string; state: string; country: string };
  coordinates: { lat: number; lng: number };
}) => {
  const res = await axiosApi.post("/bikes/vendor/bikes", {
    name,
    address,
    description,
    features,
    documents,
    images,
    location,
    coordinates,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const SaveTourDetails = async ({
  name,
  address,
  description,
  features,
  documents,
  images,
  location,
  coordinates,
}: {
  name: string;
  address: string;
  description: string;
  features: string[];
  documents: any[];
  images: any[];
  location: { city: string; state: string; country: string };
  coordinates: { lat: number; lng: number };
}) => {
  const res = await axiosApi.post("/tours/vendor/tours", {
    name,
    address,
    description,
    features,
    documents,
    images,
    location,
    coordinates,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};

export const SaveAdventureDetails = async ({
  name,
  category,
  city,
  state,
  country,
  address,
  description,
  images,
  documents,
  features,
  coordinates,
}: {
  name: string;
  category: string;
  city: string;
  state: string;
  country: string;
  address: string;
  description: string;
  images: any[];
  documents: any[];
  features: string[];
  coordinates: { lat: number; lng: number };
}) => {
  const res = await axiosApi.post("/adventures/vendor/adventures", {
    name,
    category,
    city,
    state,
    country,
    address,
    description,
    images,
    documents,
    features,
    coordinates,
  });
  return {
    success: res.data.success,
    message: res.data.message,
    currentStep: res.data.data.currentStep,
  };
};
export const saveandsubmit = async () => {
  const res = await axiosApi.post("/vendors/submit");

  return {
    success: res.data.success,
    message: res.data.message,
  };
};

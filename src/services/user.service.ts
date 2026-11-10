import { axiosApi } from "@/lib/axios";
import { vendorAccessToken } from "./auth";

export const currentUser = async () => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(vendorAccessToken)
        : null;

    if (!token) {
      return null;
    }

    // 1. Try /vendors/me
    try {
      const res = await axiosApi.get("/vendors/me");
      const data = res.data?.data;

      // Check vendor entity presence or role
      const isVendor = Boolean(
        data && (data.vendor || data.role === "vendor" || data.isVendor)
      );

      if (isVendor) {
        if (data) {
          data.role = "vendor";
          data.isVendor = true;
          if (data.vendor?.status && !data.status) {
            data.status = data.vendor.status;
          }
          if (data.vendor?.serviceType && !data.serviceType) {
            data.serviceType = data.vendor.serviceType;
          }
        }
        return res.data;
      }
    } catch (vendorMeErr: any) {
      // If server returned 404 or 500 or timeout, do not wipe token - fallback to /users/me
      if (vendorMeErr?.response?.status !== 401 && vendorMeErr?.response?.status !== 403) {
        console.warn("vendors/me unavailable, falling back to users/me:", vendorMeErr?.message);
      }
    }

    // 2. Fallback to /users/me to check vendor role and profile
    try {
      const userRes = await axiosApi.get("/users/me");
      const uData = userRes.data?.data || userRes.data;

      if (uData && (uData.role === "vendor" || uData.isVendor || uData.vendor)) {
        const storedStatus =
          (typeof window !== "undefined" ? localStorage.getItem("status") : null) ||
          uData.vendor?.status ||
          "approved";
        const storedCategory =
          (typeof window !== "undefined" ? localStorage.getItem("category") : null) ||
          uData.vendor?.serviceType ||
          "hotel";

        return {
          success: true,
          data: {
            ...uData,
            role: "vendor",
            isVendor: true,
            status: storedStatus,
            category: storedCategory,
            vendor: uData.vendor || {
              status: storedStatus,
              currentStep: 1,
              serviceType: storedCategory,
            },
          },
        };
      }
    } catch (userMeErr: any) {
      // Both /vendors/me and /users/me failed with explicit 401/403
      if (userMeErr?.response?.status === 401 || userMeErr?.response?.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(vendorAccessToken);
          localStorage.removeItem("status");
          localStorage.removeItem("category");
        }
      }
    }

    return null;
  } catch (error: any) {
    return null;
  }
};

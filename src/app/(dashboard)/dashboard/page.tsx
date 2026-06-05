'use client'

import { SectionCards } from "@/components/section-cards";
import { useCurrentUser } from "@/services/queryes";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MessageModal } from "../(categories)/rooms/_components/RoomsListing";
import { PageSkeleton } from "../(categories)/rooms/_components/details.skeleton";
import { HotelDashboard } from "./_components/charts";
import { RatingAndTasks } from "./_components/tasks";
import { useGetDashboard } from "@/services/tanstack.query";
import { useChartRanges } from "@/context/auth/ChartRangesProvider";
import { MultiServiceDashboard } from "./_components/MultiServiceDashboard";

export type DashboardData = {
  stats: Stats;
  roomSummary: RoomSummary;
  revenueChart: RevenueChartItem[];
  reservationChart: ReservationChartItem[];
  recentBookings: RecentBooking[];
};

export type Stats = {
  newBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalRevenue: number;
};

export type RoomSummary = {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
};

export type RevenueChartItem = {
  month: number;
  revenue: number;
};

export type ReservationChartItem = {
  date: string;
  booked: number;
  cancelled: number;
};

export type RecentBooking = {
  bookingReference: string;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "cancelled";
};

type Props = {};

const HotelDashboardContainer = () => {
  const { reservationDays } = useChartRanges();
  const { data: s, isLoading } = useGetDashboard(reservationDays);

  if (isLoading) return <PageSkeleton />;

  const dash = s?.data || {
    roomSummary: {},
    recentBookings: [],
    revenueChart: [],
  };

  return (
    <div className="md:flex-row flex flex-col gap-2 ">
      <div className="w-full space-y-2 ">
        <SectionCards dash={dash} />
        <HotelDashboard reservationDays={reservationDays} />
      </div>
      <div className="min-w-[300px]">
        <RatingAndTasks />
      </div>
    </div>
  );
};

const MultiServiceDashboardContainer = () => {
  return (
    <div className="md:flex-row flex flex-col gap-2 ">
      <div className="w-full space-y-2 ">
        <MultiServiceDashboard />
      </div>
      <div className="min-w-[300px]">
        <RatingAndTasks />
      </div>
    </div>
  );
};

const DashboardPage = (props: Props) => {
  const { data, isLoading } = useCurrentUser();
  const cat = data?.data?.vendor?.serviceType;

  if (isLoading) return <PageSkeleton />;

  return (
    <ErrorBoundary
      fallback={
        <MessageModal title="Error" description="Something went wrong" />
      }
    >
      <Suspense fallback={<PageSkeleton />}>
        {cat === "hotel" ? (
          <HotelDashboardContainer />
        ) : (
          <MultiServiceDashboardContainer />
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardPage;

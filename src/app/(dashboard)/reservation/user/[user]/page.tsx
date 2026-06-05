'use client'
import React from 'react'
import DashboardPage from '../../_components/users-details'
import MultiServiceBookingDetail from '../../_components/MultiServiceBookingDetail'
import { useParams } from 'next/navigation'
import { useCurrentUser } from '@/services/queryes'
import { PageSkeleton } from '../../../(categories)/rooms/_components/details.skeleton'

type Props = {}

const Page = (props: Props) => {
  const { user } = useParams();
  const id = Array.isArray(user) ? user[0] : user || "";
  const { data, isLoading } = useCurrentUser();
  const cat = data?.data?.vendor?.serviceType;

  if (isLoading) return <PageSkeleton />;

  // Hotel uses the original hotel-specific detail page
  if (cat === "hotel") {
    return <DashboardPage id={id} />;
  }

  // All other categories use the multi-service detail page
  return <MultiServiceBookingDetail id={id} />;
}

export default Page
'use client'

import React, { useEffect, useState } from 'react'
import {
    Building,
    CreditCard,
    MapPin,
    Star,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Loader2,
    Mail,
    User,
    Layers,
    DollarSign,
    Users
} from 'lucide-react'
import { axiosApi } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VendorData {
    vendor: {
        vendorId: string
        name: string
        email: string
        businessName: string
        serviceType: string
        status: string
    }
    bankDetails: {
        accountHolderName: string
        bankName: string
        accountNumber: string
        ifscCode: string
        branchName: string
        upiId: string
        verificationStatus: string
    } | null
    serviceDetails: {
        id: string
        name: string
        description: string
        address: string
        city: string | null
        rating: number
        verificationStatus: string
        isActive: boolean
    } | null
    subServices: Array<{
        id: string
        name: string
        basePrice?: number
        discountPrice?: number
        pricePerDay?: number
        capacity?: any
        carName?: string
        cabType?: string
        bikeName?: string
        bikeType?: string
        type?: string
        duration?: string
        isActive: boolean
    }>
}

function ListingPage() {
    const [data, setData] = useState<VendorData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await axiosApi.get('/vendors/my-listing')
                if (res.data && res.data.success) {
                    setData(res.data.data)
                } else {
                    setError('Failed to load listing details.')
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch listing data.')
            } finally {
                setLoading(false)
            }
        }
        fetchListing()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading your listing details...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="max-w-2xl mx-auto mt-12 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 text-center flex flex-col items-center gap-4">
                <AlertTriangle className="h-12 w-12 text-rose-500" />
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Error Loading Listing</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md">
                    {error || 'Unable to retrieve your business listing details at this moment. Please try again later.'}
                </p>
            </div>
        )
    }

    const { vendor, bankDetails, serviceDetails, subServices } = data

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60'
            case 'pending':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
            case 'rejected':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/60'
            default:
                return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
        }
    }

    const renderPrice = (item: any) => {
        if (item.basePrice !== undefined) {
            return `₹${item.basePrice}`
        }
        if (item.pricePerDay !== undefined) {
            return `₹${item.pricePerDay}/day`
        }
        return 'N/A'
    }

    const renderCapacity = (capacity: any) => {
        if (!capacity) return null
        if (typeof capacity === 'object') {
            const parts = []
            if (capacity.adults) parts.push(`${capacity.adults} Adults`)
            if (capacity.children) parts.push(`${capacity.children} Kids`)
            return parts.length > 0 ? parts.join(', ') : 'N/A'
        }
        return `${capacity} guests`
    }

    return (
        <div className="py-2 px-2 sm:px-2 lg:px-3 w-full mx-auto w-full min-h-screen flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                        My Listing
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Overview of your business listing, billing, and registered catalog offerings.
                    </p>
                </div>
                <div className="flex gap-2.5 items-center">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border ${getStatusStyle(vendor.status)}`}>
                        Vendor: {vendor.status}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
                        {vendor.serviceType}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
                <div className="lg:col-span-2 flex flex-col gap-2">
                    <Card className="bg-white dark:bg-zinc-950 rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/80">
                                <Building className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {vendor.businessName}
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    Registered Business Details
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/80 dark:border-zinc-800/60">
                                <User className="h-4 w-4 text-zinc-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Contact Person</p>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">{vendor.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/80 dark:border-zinc-800/60">
                                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Business Email</p>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">{vendor.email}</p>
                                </div>
                            </div>
                        </div>

                        {serviceDetails && (
                            <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-2">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        {serviceDetails.name}
                                    </h3>
                                    {serviceDetails.description && (
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                                            {serviceDetails.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                                    <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                                    <span>
                                        {serviceDetails.address}
                                        {serviceDetails.city ? `, ${serviceDetails.city}` : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="bg-white dark:bg-zinc-950 rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/80">
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                        Catalog Offerings
                                    </h2>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        Manage inventory and item pricing status
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {subServices.length} {subServices.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        {subServices.length === 0 ? (
                            <div className="py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-zinc-500 dark:text-zinc-400 text-sm">
                                No catalog services or items registered under this listing.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subServices.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700/80 rounded-2xl bg-white dark:bg-zinc-950/40 transition-all duration-200 flex flex-col justify-between gap-4"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 truncate text-base">
                                                    {item.name}
                                                </h4>
                                                {(item.carName || item.bikeName) && (
                                                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                                                        Vehicle: {item.carName || item.bikeName} {item.cabType || item.bikeType ? `(${item.cabType || item.bikeType})` : ''}
                                                    </p>
                                                )}
                                                {item.type && (
                                                    <p className="text-xs text-zinc-400 mt-0.5">
                                                        Type: {item.type}
                                                    </p>
                                                )}
                                                {item.duration && (
                                                    <p className="text-xs text-zinc-400 mt-0.5">
                                                        Duration: {item.duration}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase shrink-0 ${item.isActive
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                                                : 'bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800/80'
                                                }`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900/60 pt-3 text-sm">
                                            <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-bold">
                                                <DollarSign className="h-4 w-4 text-zinc-400" />
                                                <span>{renderPrice(item)}</span>
                                                {item.discountPrice && (
                                                    <span className="text-xs text-zinc-400 line-through font-normal ml-1">
                                                        ₹{item.discountPrice}
                                                    </span>
                                                )}
                                            </div>
                                            {item.capacity && (
                                                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                                                    <Users className="h-3.5 w-3.5" />
                                                    <span>{renderCapacity(item.capacity)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="flex flex-col gap-2">
                    {serviceDetails && (
                        <Card className="bg-white dark:bg-zinc-950 rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-xs">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                Listing Reputation
                            </h3>
                            <div className="flex items-center gap-4 py-2">
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-500 border border-amber-100 dark:border-amber-900/20">
                                    <Star className="h-8 w-8 fill-amber-500" />
                                </div>
                                <div>
                                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                                        {serviceDetails.rating?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-0.5">
                                        Average Traveler Rating
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="bg-white dark:bg-zinc-950 rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-6 shadow-xs relative overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/80">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                                    Payout Account
                                </h3>
                                <p className="text-[10px] text-zinc-400">
                                    Bank details for automated payouts
                                </p>
                            </div>
                        </div>

                        {bankDetails ? (
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Account Holder</p>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                        {bankDetails.accountHolderName}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Bank Name</p>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {bankDetails.bankName}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Account Number</p>
                                        <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                                            {bankDetails.accountNumber}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">IFSC Code</p>
                                        <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                                            {bankDetails.ifscCode}
                                        </p>
                                    </div>
                                </div>

                                {bankDetails.upiId && (
                                    <div className="space-y-1 border-t border-zinc-50 dark:border-zinc-900/60 pt-3">
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">UPI Address</p>
                                        <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                                            {bankDetails.upiId}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-2 flex items-center gap-2 text-xs border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                                    {bankDetails.verificationStatus === 'verified' ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Bank details verified and active</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                                            <span className="text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">Verification: {bankDetails.verificationStatus}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
                                <XCircle className="h-8 w-8 text-zinc-300" />
                                <span>No payout account setup found</span>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ListingPage;
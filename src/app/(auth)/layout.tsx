import { AuthContextProvider } from '@/context/auth/AuthContextProvider'
import { ProcessContextProvider } from '@/context/auth/ProcessContextProvider'
import HotelBackgroundSlider from '@/components/auth/hotel-background-slider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContextProvider>
      <ProcessContextProvider>
        <div className="relative min-h-screen w-full">
          <HotelBackgroundSlider />
          {children}
        </div>
      </ProcessContextProvider>
    </AuthContextProvider>
  )
}

export default layout

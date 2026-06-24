import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col px-2">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 p-2 md:gap-6 md:p-2  rounded-xl min-h-screen">
                    {children}

                </div>
            </div>
        </div>
    )
}

export default layout
"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import "src/style/Testimonials.css"

export default function Register() {
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        {
            title: "Restaurants",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 20 20 16 20 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path d="M15 4C14 6 14 8 14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19 4C18 6 18 8 18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            href: "/register/restaurant",
        },
        {
            title: "Meeting Room",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            ),
            href: "/register/meeting-room",
        },
        {
            title: "Customer Care Center",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22 12.5V16.5C22 17.6046 21.1046 18.5 20 18.5H18C16.8954 18.5 16 17.6046 16 16.5V12.5C16 11.3954 16.8954 10.5 18 10.5H22V7.5C22 5.29086 20.2091 3.5 18 3.5H6C3.79086 3.5 2 5.29086 2 7.5V16.5C2 18.7091 3.79086 20.5 6 20.5H18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path d="M9 10.5L9 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M15 10.5L15 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            href: "/register/customer-care",
        },
        {
            title: "Other",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            href: "/register/other",
        },
    ]

    return (
        <div className="min-h-screen bg-[#FFFCF5]">
            <nav className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="ml-2 text-xl font-bold">Slotzi</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-900 hover:text-gray-700">
                                Home
                            </Link>
                            <Link href="/manage" className="text-gray-900 hover:text-gray-700">
                                Manage Slot
                            </Link>
                            <Link href="/reservations" className="text-gray-900 hover:text-gray-700">
                                Reservations
                            </Link>
                            <Link href="/support" className="text-gray-900 hover:text-gray-700">
                                Support
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Search"
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your System.</h1>
                <p className="text-gray-600 mb-8">Can&apos;t find your category? Choose &apos;Other&apos;</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link key={category.title} href={category.href}>
                            <Card className="p-6 bg-[#E6E0ED] hover:bg-[#D8D0E0] transition-colors duration-200 flex flex-col items-center justify-center min-h-[200px] cursor-pointer">
                                <div className="mb-4 text-gray-900">{category.icon}</div>
                                <h2 className="text-xl font-semibold text-gray-900 text-center">{category.title}</h2>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}


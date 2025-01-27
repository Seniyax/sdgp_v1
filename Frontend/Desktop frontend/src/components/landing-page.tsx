"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="min-h-screen bg-[#e5cba7] flex items-center">
            <div className="container mx-auto flex flex-col lg:flex-row items-center">
                {/* Left Section */}
                <motion.div
                    className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col items-center lg:items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-[400px] space-y-6">
                        <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <h1 className="text-[#2D2D2D] font-bold">
                                <span className="block text-6xl tracking-tighter">SLOT</span>
                                <span className="block text-8xl tracking-tighter">Z1</span>
                            </h1>
                            <div className="space-y-1 mt-4">
                                <p className="text-[#2D2D2D] text-xl tracking-wide">PLAN AHEAD,</p>
                                <p className="text-[#2D2D2D] text-xl tracking-wide">SKIP THE LINES</p>
                            </div>
                        </motion.div>

                        <div className="pt-8">
                            <Button
                                className="bg-[#2D2D2D] text-white hover:bg-[#404040] transition-colors"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Section */}
                <motion.div
                    className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className={`
                h-full w-full relative 
                transform transition-transform duration-300
                ${isHovered ? "scale-105" : "scale-100"}
              `}
                        >
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-80Dro5pezFyT0b1oaDolHbZkqFEyeM.png"
                                alt="Restaurant ambiance"
                                fill
                                className="object-cover rounded-l-[80px]"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}


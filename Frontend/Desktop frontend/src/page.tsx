import Image from 'src/assets/beacon_restaurants-2.jpg'

export default function Page() {
    return (
        <div className="flex min-h-screen bg-[#e5cba7]">
            <div className="container flex flex-col lg:flex-row mx-auto">
                {/* Left Content */}
                <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 p-8 lg:p-16">
                    <div className="max-w-[300px] w-full">
                        <h1 className="text-[#2D2D2D] text-6xl font-bold tracking-tighter mb-4">
                            <span className="block">SLOT</span>
                            <span className="block text-8xl">Z1</span>
                        </h1>
                        <div className="mt-4 space-y-1">
                            <p className="text-[#2D2D2D] text-xl tracking-wide">PLAN AHEAD,</p>
                            <p className="text-[#2D2D2D] text-xl tracking-wide">SKIP THE LINES</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-full relative">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-80Dro5pezFyT0b1oaDolHbZkqFEyeM.png"
                                alt="People enjoying dinner"
                                fill
                                className="object-cover rounded-l-[80px]"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


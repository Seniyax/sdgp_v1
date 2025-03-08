import React, { useState } from 'react';
import "../style/Dashboard.css";
import { Calendar, Clock, User, MapPin, FileText, Filter, ChevronDown, Search } from 'lucide-react';

// Sample reservation data
const sampleReservations = [
    {
        id: 1001,
        customerName: "Alex Johnson",
        customerEmail: "alex.j@example.com",
        customerPhone: "555-123-4567",
        date: "2025-03-08",
        time: "18:30",
        partySize: 4,
        tableNumber: "B12",
        area: "Main Dining",
        specialRequests: "Window seat preferred, celebrating anniversary",
        status: "Confirmed"
    },
    {
        id: 1002,
        customerName: "Maria Garcia",
        customerEmail: "m.garcia@example.com",
        customerPhone: "555-987-6543",
        date: "2025-03-08",
        time: "19:00",
        partySize: 2,
        tableNumber: "A5",
        area: "Patio",
        specialRequests: "Allergen: Shellfish",
        status: "Confirmed"
    },
    {
        id: 1003,
        customerName: "James Wilson",
        customerEmail: "jwilson@example.com",
        customerPhone: "555-456-7890",
        date: "2025-03-08",
        time: "20:15",
        partySize: 6,
        tableNumber: "D3",
        area: "Private Room",
        specialRequests: "Business dinner, quiet area needed",
        status: "Pending"
    },
    {
        id: 1004,
        customerName: "Sarah Kim",
        customerEmail: "skim@example.com",
        customerPhone: "555-789-0123",
        date: "2025-03-09",
        time: "12:30",
        partySize: 3,
        tableNumber: "C8",
        area: "Bar Area",
        specialRequests: "",
        status: "Confirmed"
    },
    {
        id: 1005,
        customerName: "Robert Chen",
        customerEmail: "robert.c@example.com",
        customerPhone: "555-234-5678",
        date: "2025-03-09",
        time: "19:45",
        partySize: 2,
        tableNumber: "A7",
        area: "Main Dining",
        specialRequests: "Wheelchair accessible seating needed",
        status: "Confirmed"
    }
];

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState("2025-03-08");
    const [selectedArea, setSelectedArea] = useState("All Areas");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter reservations based on selected date, area, and search term
    const filteredReservations = sampleReservations.filter(reservation => {
        return (
            (selectedDate === "All Dates" || reservation.date === selectedDate) &&
            (selectedArea === "All Areas" || reservation.area === selectedArea) &&
            (searchTerm === "" ||
                reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.customerPhone.includes(searchTerm))
        );
    });

    // Group reservations by time for the time breakdown
    const reservationsByTime = {};
    filteredReservations.forEach(reservation => {
        if (!reservationsByTime[reservation.time]) {
            reservationsByTime[reservation.time] = 0;
        }
        reservationsByTime[reservation.time]++;
    });

    // Count reservations by area
    const reservationsByArea = {};
    filteredReservations.forEach(reservation => {
        if (!reservationsByArea[reservation.area]) {
            reservationsByArea[reservation.area] = 0;
        }
        reservationsByArea[reservation.area]++;
    });

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Reservation Dashboard</h1>
                    <p className="text-gray-600">Track and manage your business reservations</p>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Reservations</h2>
                        <p className="text-3xl font-bold text-blue-600">{filteredReservations.length}</p>
                        <p className="text-sm text-gray-500 mt-2">For selected filters</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Guests</h2>
                        <p className="text-3xl font-bold text-green-600">
                            {filteredReservations.reduce((sum, res) => sum + res.partySize, 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Across all reservations</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Special Requests</h2>
                        <p className="text-3xl font-bold text-purple-600">
                            {filteredReservations.filter(res => res.specialRequests !== "").length}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Requiring attention</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <Calendar className="text-gray-400" size={20} />
                            <select
                                className="border-gray-300 rounded p-2 w-full md:w-auto"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            >
                                <option value="All Dates">All Dates</option>
                                <option value="2025-03-08">March 8, 2025</option>
                                <option value="2025-03-09">March 9, 2025</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <MapPin className="text-gray-400" size={20} />
                            <select
                                className="border-gray-300 rounded p-2 w-full md:w-auto"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                            >
                                <option value="All Areas">All Areas</option>
                                <option value="Main Dining">Main Dining</option>
                                <option value="Patio">Patio</option>
                                <option value="Bar Area">Bar Area</option>
                                <option value="Private Room">Private Room</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Time and Area Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Reservations by Time</h2>
                        <div className="space-y-3">
                            {Object.entries(reservationsByTime).sort().map(([time, count]) => (
                                <div key={time} className="flex items-center">
                                    <div className="flex items-center w-16">
                                        <Clock size={16} className="text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">{time}</span>
                                    </div>
                                    <div className="flex-1 ml-2">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full"
                                                style={{ width: `${(count / filteredReservations.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="ml-2 text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Reservations by Area</h2>
                        <div className="space-y-3">
                            {Object.entries(reservationsByArea).map(([area, count]) => (
                                <div key={area} className="flex items-center">
                                    <div className="flex items-center w-28">
                                        <MapPin size={16} className="text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">{area}</span>
                                    </div>
                                    <div className="flex-1 ml-2">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-green-500 h-4 rounded-full"
                                                style={{ width: `${(count / filteredReservations.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="ml-2 text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Reservation Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">Reservation Details</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Requests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User size={16} className="text-gray-500" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                                                <div className="text-xs text-gray-500">{reservation.customerEmail}</div>
                                                <div className="text-xs text-gray-500">{reservation.customerPhone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className="text-xs text-gray-500">{reservation.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.partySize} guests</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{reservation.tableNumber}</div>
                                        <div className="text-xs text-gray-500">{reservation.area}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {reservation.specialRequests || "None"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Users, TrendingUp, DollarSign, Award, Filter, ChevronDown, Download, RefreshCw } from 'lucide-react';
import "../style/BusinessReport.css";

const BusinessReport = () => {
  // State for filter periods
  const [filterPeriod, setFilterPeriod] = useState('7days');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - in real application this would come from an API
  const [reportData, setReportData] = useState({
    businessName: "Sunset Café",
    totalReservations: 248,
    totalCustomers: 579,
    averageRating: 4.7,
    revenue: 8745.50,
    completionRate: 94.2,
    percentageChange: 12.5,
    
    // Data for charts
    reservationsByDay: [
      { name: 'Mon', reservations: 35, customers: 78 },
      { name: 'Tue', reservations: 28, customers: 62 },
      { name: 'Wed', reservations: 42, customers: 93 },
      { name: 'Thu', reservations: 38, customers: 85 },
      { name: 'Fri', reservations: 51, customers: 120 },
      { name: 'Sat', reservations: 65, customers: 158 },
      { name: 'Sun', reservations: 47, customers: 101 }
    ],
    
    reservationsByTime: [
      { time: '9:00', reservations: 12 },
      { time: '10:00', reservations: 19 },
      { time: '11:00', reservations: 28 },
      { time: '12:00', reservations: 35 },
      { time: '13:00', reservations: 42 },
      { time: '14:00', reservations: 31 },
      { time: '15:00', reservations: 24 },
      { time: '16:00', reservations: 18 },
      { time: '17:00', reservations: 22 },
      { time: '18:00', reservations: 29 },
      { time: '19:00', reservations: 17 }
    ],
    
    reservationStatus: [
      { name: 'Completed', value: 78 },
      { name: 'Cancelled', value: 12 },
      { name: 'No-show', value: 6 },
      { name: 'Rescheduled', value: 4 }
    ],
    
    customerTypes: [
      { name: 'New', value: 35 },
      { name: 'Returning', value: 65 }
    ],
    
    topServices: [
      { name: 'Coffee & Pastry', value: 126 },
      { name: 'Lunch Special', value: 89 },
      { name: 'Business Meeting', value: 45 },
      { name: 'Breakfast Combo', value: 67 },
      { name: 'Evening Dessert', value: 39 }
    ],
    
    recentReservations: [
      { id: 1, customer: 'Emma Thompson', date: '2025-03-20', time: '10:30', guests: 3, status: 'confirmed' },
      { id: 2, customer: 'James Wilson', date: '2025-03-20', time: '12:15', guests: 2, status: 'completed' },
      { id: 3, customer: 'Sarah Parker', date: '2025-03-20', time: '13:45', guests: 4, status: 'confirmed' },
      { id: 4, customer: 'Michael Brown', date: '2025-03-20', time: '15:00', guests: 1, status: 'confirmed' },
      { id: 5, customer: 'Olivia Johnson', date: '2025-03-21', time: '11:30', guests: 2, status: 'confirmed' }
    ]
  });

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    'Completed': '#4CAF50',
    'Cancelled': '#F44336',
    'No-show': '#FF9800',
    'Rescheduled': '#2196F3'
  };
  
  // Function to update data based on filter period
  const updateDataByPeriod = (period) => {
    setFilterPeriod(period);
    setShowFilterDropdown(false);
    
    // In a real application, you would fetch data based on the selected period
    // For demo, we'll just simulate a loading state
    const loadingTimeout = setTimeout(() => {
      // Simulate new data here
      // For demo purposes, we're just keeping the same data
    }, 500);
    
    return () => clearTimeout(loadingTimeout);
  };
  
  // Function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Function to format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };
  
  return (
    <div className="business-report-container">
      <header className="report-header">
        <div>
          <h1>{reportData.businessName} Dashboard</h1>
          <p className="subtitle">Business insights and reservation analytics</p>
        </div>
        <div className="header-actions">
          <div className="filter-dropdown">
            <button className="btn-filter" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
              <Filter size={16} />
              {filterPeriod === '7days' && 'Last 7 Days'}
              {filterPeriod === '30days' && 'Last 30 Days'}
              {filterPeriod === '90days' && 'Last 90 Days'}
              {filterPeriod === 'year' && 'This Year'}
              <ChevronDown size={16} />
            </button>
            
            {showFilterDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => updateDataByPeriod('7days')}>Last 7 Days</button>
                <button onClick={() => updateDataByPeriod('30days')}>Last 30 Days</button>
                <button onClick={() => updateDataByPeriod('90days')}>Last 90 Days</button>
                <button onClick={() => updateDataByPeriod('year')}>This Year</button>
              </div>
            )}
          </div>
          
          <button className="btn-refresh">
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button className="btn-download">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </header>
      
      <div className="tab-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'reservations' ? 'active' : ''} 
          onClick={() => setActiveTab('reservations')}
        >
          Reservations
        </button>
        <button 
          className={activeTab === 'customers' ? 'active' : ''} 
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button 
          className={activeTab === 'services' ? 'active' : ''} 
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="report-metrics">
            <div className="metric-card">
              <div className="metric-icon reservations">
                <Calendar size={24} />
              </div>
              <div className="metric-data">
                <h3>Total Reservations</h3>
                <div className="metric-value">{reportData.totalReservations}</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  {reportData.percentageChange}% from previous period
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon customers">
                <Users size={24} />
              </div>
              <div className="metric-data">
                <h3>Total Customers</h3>
                <div className="metric-value">{reportData.totalCustomers}</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  8.3% from previous period
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon revenue">
                <DollarSign size={24} />
              </div>
              <div className="metric-data">
                <h3>Estimated Revenue</h3>
                <div className="metric-value">{formatCurrency(reportData.revenue)}</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  10.2% from previous period
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon rating">
                <Award size={24} />
              </div>
              <div className="metric-data">
                <h3>Completion Rate</h3>
                <div className="metric-value">{formatPercentage(reportData.completionRate)}</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  2.1% from previous period
                </div>
              </div>
            </div>
          </div>
          
          <div className="chart-grid">
            <div className="chart-card wide">
              <div className="chart-header">
                <h2>Reservations by Day</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.reservationsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="reservations" 
                      stroke="#0088FE" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                      name="Reservations"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#00C49F" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                      name="Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2>Reservation Status</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportData.reservationStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.reservationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Reservations']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2>Customer Types</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportData.customerTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card wide">
              <div className="chart-header">
                <h2>Popular Reservation Times</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.reservationsByTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reservations" name="Reservations" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="recent-section">
            <div className="recent-header">
              <h2>Recent Reservations</h2>
              <button className="btn-text">View All</button>
            </div>
            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.recentReservations.map(reservation => (
                    <tr key={reservation.id}>
                      <td>{reservation.customer}</td>
                      <td>{reservation.date}</td>
                      <td>{reservation.time}</td>
                      <td>{reservation.guests}</td>
                      <td>
                        <span className={`status-pill ${reservation.status}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon">View</button>
                          <button className="btn-icon">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'reservations' && (
        <div className="tab-content">
          <div className="chart-grid">
            <div className="chart-card wide">
              <div className="chart-header">
                <h2>Hourly Reservation Distribution</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.reservationsByTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reservations" name="Reservations" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card wide">
              <div className="chart-header">
                <h2>Reservation Completion Analysis</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.reservationStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.reservationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [value, 'Reservations']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'customers' && (
        <div className="tab-content">
          <div className="chart-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Customer Segmentation</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.customerTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value}%`, 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <div className="chart-header">
                <h2>Customer Growth</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.reservationsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#00C49F" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                      name="Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'services' && (
        <div className="tab-content">
          <div className="chart-grid">
            <div className="chart-card wide">
              <div className="chart-header">
                <h2>Popular Services</h2>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={reportData.topServices}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="report-footer">
        <p>© 2025 Slotzi Business Analytics • Last updated: March 20, 2025</p>
      </footer>
    </div>
  );
};

export default BusinessReport;
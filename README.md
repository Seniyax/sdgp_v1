# Slotzi - Online Hotel Booking Application

## Overview

Slotzi is a comprehensive online hotel booking platform developed as part of a Software Development Group Project (SDGP). The application streamlines the hotel reservation process by providing a seamless, secure, and user-friendly experience for both customers and hotel businesses. Slotzi consists of a mobile application for customers to browse and book hotels and a web application for hotel administrators to manage reservations and room inventory.

## Features

- **Real-Time Booking**: Check room availability and make reservations instantly with synchronized data across platforms.
- **Secure Payment Integration**: Supports multiple payment methods through trusted gateways, ensuring safe transactions.
- **Interactive User Interface**: Intuitive design with search filters, room previews, and booking summaries for an enhanced user experience.
- **Advanced Space Category System**: Enables hotels to categorize rooms by type, amenities, and pricing, allowing customers to choose based on preferences.

## Project Structure

- **Mobile Application**: A customer-facing app built for iOS and Android, enabling users to browse hotels, book rooms, and manage reservations.
- **Web Application**: A business-facing dashboard for hotel administrators to monitor bookings, manage inventory, and generate reports.
- **Backend Infrastructure**: A robust server-side system handling real-time data processing, payment integration, and communication between mobile and web applications.

## Tech Stack

### Web Frontend

- **React.js**: For building a dynamic and responsive web interface for hotel administrators.

### Mobile Frontend

- **React Native**: For developing a cross-platform mobile application compatible with iOS and Android.

### Backend

- **Node.js**: For creating a scalable server-side environment.
- **Express.js**: For building RESTful APIs to handle communication between frontend and backend.
- **Supabase**: For database management, authentication, and real-time data synchronization.

### Deployment

- **Vercel**: For hosting the web frontend, ensuring fast and reliable deployment.
- **Railway**: For deploying the backend services, providing scalable infrastructure.

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project setup
- Vercel and Railway accounts for deployment

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Seniyax/sdgp_v1.git
   cd slotzi
2. **Install Dependencies**

   ```bash
   cd webFrontend
   npm install
   
   cd MobileFrontend
   npm install

   cd Backend
   npm install
3. **Run Locally**

   ```bash
   cd WebFrontend
   npm run dev

   cd MobileFrontend
   npx expo

   cd Backend
   npm start

## Contact

For inquiries or support, please contact the Slotzi team at inquries@slotzi.lk.
    

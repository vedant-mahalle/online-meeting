# Online Meeting Platform

This is a modern online meeting platform built with Next.js, featuring real-time communication capabilities powered by Socket.IO. It aims to provide a seamless and interactive experience for virtual meetings.

## ✨ Features

*   **Real-time Communication:** Instant messaging and potential for audio/video streaming via Socket.IO.
*   **Modern UI:** Built with Radix UI and styled using Tailwind CSS for a sleek and responsive design.
*   **Next.js Framework:** Leverages Next.js for efficient server-side rendering, routing, and API handling.
*   **TypeScript:** Ensures type safety and improves code maintainability.

## 🚀 Technologies Used

*   **Next.js:** React framework for production.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Superset of JavaScript that adds static types.
*   **Socket.IO:** A library that enables real-time, bidirectional, event-based communication.
*   **Radix UI:** A collection of unstyled, accessible UI components.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Zod & React Hook Form:** For robust form validation.

## 📦 Installation

To get a copy of the project up and running on your local machine, follow these steps.

### Prerequisites

Ensure you have Node.js (v18 or higher) and pnpm installed. If you don't have pnpm, you can install it via npm:

```bash
npm install -g pnpm
```

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/online-meeting-platform.git
    cd online-meeting-platform
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Enable HTTPS for local development:**
    As configured in `package.json`, the `dev` script now supports HTTPS. If you encounter certificate issues, you might need `mkcert`.
    
    You can install `mkcert` by following the instructions on its official GitHub page: [https://github.com/FiloSottile/mkcert#installation](https://github.com/FiloSottile/mkcert#installation)

    For development purposes, if you face `unable to verify the first certificate` errors, you can create a `.env.local` file in the project root with the following content (use with caution, for development only):

    ```
    NODE_TLS_REJECT_UNAUTHORIZED=0
    ```

## ▶️ Running the Application

To start the development server with HTTPS enabled:

```bash
pnpm run dev
```

This will run the application on `https://localhost:3000` (or another port if configured).

You can also build and start the application in production mode:

```bash
pnpm run build
pnpm run start
```

## 📂 Project Structure

Here's a high-level overview of the project directory structure:

```
.
├── app/                  # Next.js App Router for pages and API routes
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── public/               # Static assets (images, etc.)
├── styles/               # Global styles and Tailwind CSS configurations
├── types/                # TypeScript custom type definitions
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # pnpm lock file
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project README (this file)
```

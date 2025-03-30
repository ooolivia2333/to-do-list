# Todo List Application

A simple todo list application built with React (frontend) and Express/SQLite (backend).

## Getting Started

### Prerequisites
- Node.js installed on your machine
- npm (Node Package Manager)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   node index.js
   ```
   The server will start on port 30000.

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   The React application will start and can be accessed at http://localhost:5173

## Features

- Add new tasks
- View list of tasks
- Add tags for tasks and filter based on tags
- Add reminder for a task
- Persistent storage using SQLite database
- Modern UI with Tailwind CSS

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- Backend:
  - Node.js
  - Express
  - SQLite3

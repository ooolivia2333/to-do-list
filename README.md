# Todo List Application

A simple todo list application built with React (frontend) and Express/SQLite (backend).

![Demo picture](/sample.png)

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

### Task Management
- Create new tasks
- Mark tasks as complete/incomplete
- Completed tasks automatically move to bottom
- Delete tasks

### Tag System
- Add tags to tasks
- Filter tasks by tags
- Tags displayed as badges
- Multi-tag filtering support

### Reminder System
- Set date and time reminders for tasks
- Visual reminder badges showing scheduled time
- Reminder modification support
- Date/time picker with confirmation

### UI/UX Features
- Clean, modern interface
- Real-time updates
- Responsive design
- Interactive task management
- Smooth animations and transitions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Modern React Hooks
- React DatePicker for reminder selection
- Custom CSS for styling

### Backend
- Node.js with Express
- SQLite3 for persistent storage
- RESTful API architecture
# Task Tracker

A simple Angular application for managing tasks with full CRUD (Create, Read, Update, Delete) functionality. All data is stored in memory - no database required!

## Features

- ✅ Create new tasks
- 📝 Update existing tasks
- 🗑️ Delete tasks
- 👀 View all tasks
- 🎨 Modern, responsive UI
- 💾 In-memory data storage (no database needed)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd task-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

- **View Tasks**: The home page displays all your tasks
- **Create Task**: Click "New Task" button to create a new task
- **Edit Task**: Click "Edit" button on any task to modify it
- **Delete Task**: Click "Delete" button on any task to remove it

## Project Structure

```
task-tracker/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-list/      # Component for viewing all tasks
│   │   │   └── task-form/      # Component for creating/editing tasks
│   │   ├── models/
│   │   │   └── task.model.ts   # Task interface definition
│   │   ├── services/
│   │   │   └── task.service.ts # Service for task management (in-memory storage)
│   │   ├── app.component.ts    # Root component
│   │   └── app.routes.ts       # Routing configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## Data Storage

All task data is stored in memory using the `TaskService`. The service maintains an array of tasks and provides methods for CRUD operations. Data persists during the session but will be reset when the application is reloaded.

## Technologies Used

- Angular 17
- TypeScript
- RxJS
- Angular Router
- Angular Forms (Reactive Forms)


# task-management
# Task Management

A task management built using laravel, react and livewire.

## Features

- User authentication (Login and Registration)
- Create, read, update, and delete tasks
- Each task includes a title, description, status (pending/completed), and due date
- Task Status update using livewire
- On Dashboard there is a list of tasks with filter options and search functionality
- Pagination for task lists
- Role-based permissions:
  - Regular users can manage their own tasks
  - Admin users can manage all tasks

## Technologies Used

### Backend
- **Laravel**: PHP framework for backend
- **MySQL**: Database
- **Livewire**: 

### Frontend
- **React**: JavaScript framework for building user interfaces
- **Axios**: For making HTTP requests to the Laravel backend

## Installation Instructions

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.17.1
- NPM
- MySQL database

### Setup Backend (Laravel)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-management-app.git
   cd task-management-app

### Install Dependencies
 - composer install
 - npm install
 - create .env file
 - php artisan key:generate
 - php artisan migrate
 - php artisan db:seed
 - npm run dev in new terminal
 - php artisan serve 

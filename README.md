
# weVote

**weVote** is a web application designed to provide a seamless voting experience for tenants who live in the same building. It allows tenants to submit their votes, view poll results, and track active and closed polls.

## Features

- **User Authentication**: Sign up, login, and authentication system for secure access.
- **Vote in Polls**: Users can vote in active polls and see live results.
- **Admin Controls**: Admins can create, edit and close polls.
- **Real-Time Updates**: Instant updates on poll status and results.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Technologies Used

- **Frontend**: React, Vite, Shadcn/ui
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT, bcrypt.js
- **Styling**: Tailwind CSS (v4.0)
## Run Locally

### Prerequisites

Ensure you have the following installed:
- Node.js (>=14.x)
- MySQL

### Setup

1. Clone the project

```bash
    git clone https://github.com/your-username/weVote.git
```

2. Navigate to the project directory

```bash
    cd weVote
```

3. Install dependencies in each folder (api and app):

```bash
    cd api
    npm install

    cd app
    npm install
```

4. Start the servers

In the api folder:

```bash
    npm run dev
```

In the app folder:

```bash
    npm run dev
```

5. Create the MySQL database:
```mysql
    CREATE DATABASE weVote;
    USE weVote;
```

6. Create the database tables:
```mysql
    CREATE TABLE IF NOT EXISTS tenants (
    id INT auto_increment PRIMARY KEY,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    tenantID VARCHAR(9) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    apartment TINYINT UNSIGNED NOT NULL CHECK (apartment BETWEEN 1 AND 90),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

    CREATE TABLE IF NOT EXISTS polls (
    id INT auto_increment PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    deadline DATE NOT NULL,
    details TEXT,
    isActive BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

    CREATE TABLE IF NOT EXISTS votes (
    id INT auto_increment PRIMARY KEY,
    pollId INT NOT NULL,
    apartment TINYINT UNSIGNED NOT NULL CHECK (apartment BETWEEN 1 AND 80),
    vote VARCHAR(3) NOT NULL CHECK (vote IN ('yes', 'no')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE);
```

7. Set up environment variables:
- In the api folder create a .env file and set the following variables:

```bash
    DB_HOST=your_hostname
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_PORT=your_port

    JWT_SECRET=your_jwt_secret
```

8. Start your development servers:

In api:

```bash    
    npm run dev
```

In app:

```bash
    npm run dev
```

Enjoy =)
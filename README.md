# Kodbank Project

A simple full-stack banking application built with React, Node.js, Express, and Aiven MySQL.

## Features Included
- **User Registration**: Secure sign-up storing user details with encrypted passwords and default balance of $100,000.
- **User Login**: Authentication system using JWT (JSON Web Tokens) and bcrypt. Store JWT in UserToken table.
- **User Dashboard**: Premium design dashboard to check balance.
- **Balance checking**: Retrieves balance from a secure endpoint by verifying the JWT signature, and checking for token expiration.
- **Animation**: Party popper/confetti effect when balance is successfully checked.
- **UI/UX**: Beautiful gradient and glassmorphic premium design layout.

## Setup Instructions

### 1. Database Configuration (Backend)
1. Open the `/backend/.env` file.
2. Replace the placeholder values with your actual Aiven MySQL credentials:
   \`\`\`env
   DB_HOST=your_aiven_db_host
   DB_USER=your_aiven_db_user
   DB_PASSWORD=your_aiven_db_password
   DB_NAME=kodbank
   DB_PORT=your_aiven_db_port
   JWT_SECRET=supersecretkodbankkey
   PORT=5000
   \`\`\`
   *(Note: The database tables \`KodUser\` and \`UserToken\` will be created automatically when you start the backend server).*

### 2. Run the Backend Server
Open a new terminal, navigate to the \`backend\` folder, and run:
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
It should output: \`Database tables checked/created successfully.\` and \`Server is running on port 5000\`.

### 3. Run the Frontend App
Open another terminal, navigate to the \`frontend\` folder, and run:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The application will be accessible at \`http://localhost:5173\`.

## Flow Implementation Guide Used
- **Registration** -> Captures details, defaults Role to "Customer" and Balance to 100000. Navigates to Login.
- **Login** -> Validates, creates JWT with subject as Username and Claim as Role. Signs with secret. Stores in \`UserToken\` table. Sends Token as Cookie and JSON. 
- **Dashboard (/userdashboard)** -> Fetches token, validates user, checks balance using backend API \`/api/auth/balance\`.
- **Validation** -> Balance fetch verifies if token missing, expired, or invalid and gracefully handles UI errors.

Enjoy Kodbank!

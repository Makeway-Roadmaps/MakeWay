# Project Setup Guide

## Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to create your own `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and update the values:
     - `PORT`: Server port (default: 8000)
     - `MONGO_DB_URL`: Your MongoDB connection string
     - `MAIL_HOST`: Your email service SMTP host
     - `MAIL_USER`: Your email address
     - `MAIL_PASS`: Your email password/app password
     - `JWT_SECRET`: Your custom JWT secret key
     - `JWT_EXPIRES_IN`: JWT token expiration time

4. Start the server:
   ```bash
   npm start
   ```

## Important Notes
- Never commit the `.env` file to version control
- Make sure MongoDB is running locally or update the MONGO_DB_URL to point to your MongoDB instance
- For email functionality, you'll need to set up your own email credentials

# MakeWay API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication APIs

### 1. Send OTP
Send a verification OTP to the user's email address.

```http
POST /otp-Sender
```

#### Request Body
```json
{
    "email": "user@example.com"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "OTP sent successfully"
}
```

#### Error Responses
**Status Code:** 400
```json
{
    "message": "Email is required"
}
```
OR
```json
{
    "message": "Email already exists"
}
```

**Status Code:** 500
```json
{
    "message": "Error occurred while sending OTP"
}
```

### 2. Resend OTP
Resend verification OTP to the user's email address.

```http
POST /resend-otp
```

#### Request Body
```json
{
    "email": "user@example.com"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "OTP resent successfully"
}
```

#### Error Responses
**Status Code:** 400
```json
{
    "message": "Email is required"
}
```

**Status Code:** 500
```json
{
    "message": "Error occurred while resending OTP"
}
```

### 3. User Signup
Register a new user with email verification.

```http
POST /signup
```

#### Request Body
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123",
    "otp": "123456"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
    }
}
```

#### Error Responses
**Status Code:** 400
```json
{
    "message": "All fields are required"
}
```
OR
```json
{
    "message": "Passwords do not match"
}
```
OR
```json
{
    "message": "Invalid OTP"
}
```

### 4. User Login
Authenticate a user and get access token.

```http
POST /login
```

#### Request Body
```json
{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
    }
}
```

#### Error Responses
**Status Code:** 401
```json
{
    "message": "Invalid email or password"
}
```

### 5. Get User Details (Protected Route)
Get authenticated user details.

```http
GET /user
```

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "User is authenticated"
}
```

#### Error Response
**Status Code:** 401
```json
{
    "success": false,
    "message": "Unauthorized Access"
}
```

### 6. Get Admin Details (Protected Route)
Get authenticated admin details.

```http
GET /admin
```

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "User is authenticated"
}
```

#### Error Response
**Status Code:** 401
```json
{
    "success": false,
    "message": "Unauthorized Access"
}
```

### 7. Forgot Password
Request a password reset link.

```http
POST /forgotPassword
```

#### Request Body
```json
{
    "email": "user@example.com"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "Password reset email sent successfully"
}
```

#### Error Response
**Status Code:** 400
```json
{
    "success": false,
    "message": "User not found"
}
```

### 8. Reset Password
Reset user's password using reset token.

```http
POST /resetPassword
```

#### Request Body
```json
{
    "password": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123",
    "token": "reset_token_here"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "Password reset successful"
}
```

#### Error Response
**Status Code:** 400
```json
{
    "success": false,
    "message": "Invalid or expired reset token"
}
```

### 9. Update Profile (Protected Route)
Update user profile information.

```http
PUT /profile
```

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
    }
}
```

### 10. Change Password (Protected Route)
Update user's password.

```http
PUT /change-password
```

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
    "oldPassword": "currentPassword123",
    "newPassword": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123"
}
```

#### Success Response
**Status Code:** 200
```json
{
    "success": true,
    "message": "Password updated successfully"
}
```

#### Error Response
**Status Code:** 400
```json
{
    "success": false,
    "message": "Current password is incorrect"
}
```

## Security Recommendations

1. Always use HTTPS in production
2. Implement rate limiting for all endpoints
3. Use strong password validation
4. Implement proper session management
5. Regular security audits
6. Monitor for unusual activities

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- Maximum 100 requests per hour per IP address
- Maximum 5 requests per minute per email address for OTP related endpoints

## Environment Variables Required

```env
PORT=8000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
MAIL_HOST=your_smtp_host
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

## Error Codes

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Testing

Base URL for testing: `http://localhost:8000/api/v1`

You can use tools like Postman or cURL to test these endpoints. Remember to:
1. Set the Content-Type header to application/json
2. Include the JWT token in the Authorization header for protected routes
3. Use valid test data that matches the required formats

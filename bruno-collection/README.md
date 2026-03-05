# NFC Digital Profile API - Bruno Collection

This is a complete Bruno API collection for testing the NFC Digital Profile backend API.

## Getting Started

### 1. Install Bruno
Download and install Bruno from: https://www.usebruno.com/

### 2. Open Collection
1. Open Bruno
2. Click "Open Collection"
3. Navigate to this folder: `/Users/x2/Documents/projects/nfc-cards/bruno-collection`
4. Select the folder

### 3. Select Environment
1. Click on the environment dropdown in the top right
2. Select "Local"
3. The baseUrl will be set to `http://localhost:4000/api`

## How to Use

### Step 1: Register or Login
1. Go to **Authentication** → **Login**
2. Click "Send" to authenticate with your credentials
3. The `accessToken` and `userId` will be automatically saved to environment variables

### Step 2: Create a Profile
1. Go to **Profiles** → **Create Profile**
2. Modify the request body if needed
3. Click "Send"
4. The `profileId`, `uniqueId`, and `username` will be automatically saved

### Step 3: Test Other Endpoints
All protected endpoints automatically use the saved `{{accessToken}}` from the Login request.

## Features

### Auto-Save Variables
- **Login/Register**: Automatically saves `accessToken` and `userId`
- **Create Profile**: Automatically saves `profileId`, `uniqueId`, and `username`
- All subsequent requests use these variables automatically

### Request Categories
1. **Authentication** (6 requests)
   - Register, Login, Email Verification, Password Reset

2. **Users** (3 requests)
   - Get current user, Update, Delete

3. **Profiles** (8 requests)
   - CRUD operations, Public profiles, Username check

4. **Storage** (3 requests)
   - Upload profile image, cover image, company logo

5. **Analytics** (5 requests)
   - View statistics, device breakdown, recent views

6. **NFC** (6 requests)
   - Tag management, activation, redirect testing

## Environment Variables

The Local environment includes:
- `baseUrl`: http://localhost:4000/api
- `accessToken`: Auto-populated on login
- `userId`: Auto-populated on login/register
- `profileId`: Auto-populated on profile creation
- `uniqueId`: Auto-populated on profile creation
- `username`: Auto-populated on profile creation

## Tips

1. **Start with Login**: Always login first to get your access token
2. **Create Profile**: Create a profile to populate profileId and other variables
3. **File Uploads**: For storage endpoints, update the file path in the multipart form
4. **Public Endpoints**: Profile viewing and username check don't require authentication
5. **Query Parameters**: Some requests have query parameters you can modify (dates, limits, etc.)

## Example Workflow

```
1. Login → saves accessToken
2. Create Profile → saves profileId, uniqueId, username
3. Upload Profile Image → uses accessToken
4. Get Profile Analytics → uses accessToken and profileId
5. Get Public Profile → test public access with uniqueId or username
```

## Notes

- Make sure your backend is running on `http://localhost:4000`
- The Login request is pre-filled with your credentials (jpinedom@hotmail.com)
- All requests include proper authentication where required
- Post-response scripts automatically save important IDs and tokens

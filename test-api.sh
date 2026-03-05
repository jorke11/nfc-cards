#!/bin/bash

# NFC Digital Profile Platform - API Testing Script
# This script tests all API endpoints in a logical flow

BASE_URL="http://localhost:4000/api"
FRONTEND_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables to store tokens and IDs
ACCESS_TOKEN=""
USER_ID=""
PROFILE_ID=""
PROFILE_UNIQUE_ID=""
VERIFICATION_TOKEN=""

echo "========================================="
echo "NFC Digital Profile Platform - API Tests"
echo "========================================="
echo ""

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to extract JSON value
get_json_value() {
    echo $1 | grep -o "\"$2\":\"[^\"]*" | grep -o '[^"]*$'
}

echo "======================================"
echo "1. HEALTH CHECK"
echo "======================================"
response=$(curl -s "$BASE_URL")
echo "Response: $response"
if [[ $response == *"NFC"* ]]; then
    print_result 0 "Health check passed"
else
    print_result 1 "Health check failed"
fi
echo ""

echo "======================================"
echo "2. AUTHENTICATION - REGISTER"
echo "======================================"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
TEST_PASSWORD="SecurePass123!"
TEST_FIRSTNAME="John"
TEST_LASTNAME="Doe"

echo "Registering user: $TEST_EMAIL"
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"firstName\": \"$TEST_FIRSTNAME\",
    \"lastName\": \"$TEST_LASTNAME\"
  }")

echo "Response: $response"

if [[ $response == *"userId"* ]]; then
    print_result 0 "User registration successful"
    USER_ID=$(echo $response | grep -o '"userId":"[^"]*' | cut -d'"' -f4)
    echo "User ID: $USER_ID"
else
    print_result 1 "User registration failed"
fi
echo ""

echo "======================================"
echo "3. AUTHENTICATION - LOGIN"
echo "======================================"
echo "Logging in with: $TEST_EMAIL"
response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response: $response"

if [[ $response == *"accessToken"* ]]; then
    print_result 0 "Login successful"
    ACCESS_TOKEN=$(echo $response | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
else
    print_result 1 "Login failed"
fi
echo ""

echo "======================================"
echo "4. AUTHENTICATION - GET CURRENT USER"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $response"

if [[ $response == *"email"* ]]; then
    print_result 0 "Get current user successful"
else
    print_result 1 "Get current user failed"
fi
echo ""

echo "======================================"
echo "5. USERS - GET USER PROFILE"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $response"

if [[ $response == *"email"* ]]; then
    print_result 0 "Get user profile successful"
else
    print_result 1 "Get user profile failed"
fi
echo ""

echo "======================================"
echo "6. PROFILES - CREATE PROFILE"
echo "======================================"
response=$(curl -s -X POST "$BASE_URL/profiles" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"$TEST_FIRSTNAME\",
    \"lastName\": \"$TEST_LASTNAME\"
  }")

echo "Response: $response"

if [[ $response == *"uniqueId"* ]]; then
    print_result 0 "Profile creation successful"
    PROFILE_ID=$(echo $response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    PROFILE_UNIQUE_ID=$(echo $response | grep -o '"uniqueId":"[^"]*' | cut -d'"' -f4)
    echo "Profile ID: $PROFILE_ID"
    echo "Profile Unique ID: $PROFILE_UNIQUE_ID"
else
    print_result 1 "Profile creation failed"
fi
echo ""

echo "======================================"
echo "7. PROFILES - GET MY PROFILE"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/profiles/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $response"

if [[ $response == *"uniqueId"* ]]; then
    print_result 0 "Get my profile successful"
else
    print_result 1 "Get my profile failed"
fi
echo ""

echo "======================================"
echo "8. PROFILES - UPDATE PROFILE"
echo "======================================"
TEST_USERNAME="johndoe${TIMESTAMP}"
response=$(curl -s -X PATCH "$BASE_URL/profiles/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"bio\": \"Software Developer & Tech Enthusiast\",
    \"jobTitle\": \"Full Stack Developer\",
    \"company\": \"Tech Corp\",
    \"phone\": \"+1-555-1234\",
    \"website\": \"https://johndoe.com\",
    \"socialLinks\": {
      \"twitter\": \"https://twitter.com/johndoe\",
      \"linkedin\": \"https://linkedin.com/in/johndoe\",
      \"github\": \"https://github.com/johndoe\"
    },
    \"themeSettings\": {
      \"primaryColor\": \"#4F46E5\",
      \"backgroundColor\": \"#FFFFFF\"
    }
  }")

echo "Response: $response"

if [[ $response == *"$TEST_USERNAME"* ]]; then
    print_result 0 "Profile update successful"
else
    print_result 1 "Profile update failed"
fi
echo ""

echo "======================================"
echo "9. PROFILES - CHECK USERNAME AVAILABILITY"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/profiles/check-username/testuser123")

echo "Response: $response"

if [[ $response == *"available"* ]]; then
    print_result 0 "Username check successful"
else
    print_result 1 "Username check failed"
fi
echo ""

echo "======================================"
echo "10. PROFILES - GET PROFILE BY USERNAME (PUBLIC)"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/profiles/username/$TEST_USERNAME")

echo "Response: $response"

if [[ $response == *"$TEST_USERNAME"* ]]; then
    print_result 0 "Get profile by username successful"
else
    print_result 1 "Get profile by username failed"
fi
echo ""

echo "======================================"
echo "11. PROFILES - GET PROFILE BY ID (PUBLIC)"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/profiles/$PROFILE_UNIQUE_ID")

echo "Response: $response"

if [[ $response == *"uniqueId"* ]]; then
    print_result 0 "Get profile by ID successful"
else
    print_result 1 "Get profile by ID failed"
fi
echo ""

echo "======================================"
echo "12. NFC - REDIRECT TO PROFILE"
echo "======================================"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/nfc/$PROFILE_UNIQUE_ID")
http_code=$(echo "$response" | tail -n1)

echo "HTTP Code: $http_code"

if [ "$http_code" = "302" ] || [ "$http_code" = "301" ]; then
    print_result 0 "NFC redirect successful"
else
    print_result 1 "NFC redirect failed"
fi
echo ""

echo "======================================"
echo "13. ANALYTICS - TRACK PROFILE VIEW"
echo "======================================"
response=$(curl -s -X POST "$BASE_URL/analytics/track/$PROFILE_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)\",
    \"referrer\": \"https://google.com\"
  }")

echo "Response: $response"

if [[ $response == *"success"* ]] || [[ $response == *"id"* ]]; then
    print_result 0 "Track profile view successful"
else
    print_result 1 "Track profile view failed"
fi
echo ""

echo "======================================"
echo "14. ANALYTICS - GET MY ANALYTICS"
echo "======================================"
response=$(curl -s -X GET "$BASE_URL/analytics/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $response"

if [[ $response == *"totalViews"* ]] || [[ $response == "[]" ]]; then
    print_result 0 "Get my analytics successful"
else
    print_result 1 "Get my analytics failed"
fi
echo ""

echo "======================================"
echo "15. STORAGE - GET UPLOAD URL"
echo "======================================"
response=$(curl -s -X POST "$BASE_URL/storage/upload-url" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"fileName\": \"profile-photo.jpg\",
    \"fileType\": \"image/jpeg\"
  }")

echo "Response: $response"

if [[ $response == *"uploadUrl"* ]]; then
    print_result 0 "Get upload URL successful (DEV MODE - returns mock URL)"
else
    print_result 1 "Get upload URL failed"
fi
echo ""

echo "======================================"
echo "16. PROFILES - TOGGLE PROFILE STATUS"
echo "======================================"
response=$(curl -s -X PATCH "$BASE_URL/profiles/me/status" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}')

echo "Response: $response"

if [[ $response == *"\"isEnabled\":false"* ]]; then
    print_result 0 "Toggle profile status successful (disabled)"
else
    print_result 1 "Toggle profile status failed"
fi

# Re-enable the profile
response2=$(curl -s -X PATCH "$BASE_URL/profiles/me/status" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}')

if [[ $response2 == *"\"isEnabled\":true"* ]]; then
    print_result 0 "Toggle profile status successful (re-enabled)"
else
    print_result 1 "Re-enable profile failed"
fi
echo ""

echo "======================================"
echo "17. USERS - UPDATE USER INFO"
echo "======================================"
NEW_EMAIL="newemail${TIMESTAMP}@example.com"
response=$(curl -s -X PATCH "$BASE_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$NEW_EMAIL\"
  }")

echo "Response: $response"

if [[ $response == *"$NEW_EMAIL"* ]]; then
    print_result 0 "Update user info successful"
else
    print_result 1 "Update user info failed"
fi
echo ""

echo "======================================"
echo "18. AUTHENTICATION - REQUEST PASSWORD RESET"
echo "======================================"
response=$(curl -s -X POST "$BASE_URL/auth/request-password-reset" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$NEW_EMAIL\"
  }")

echo "Response: $response"

if [[ $response == *"message"* ]] || [[ $response == *"success"* ]]; then
    print_result 0 "Password reset request successful (check backend console for reset link)"
else
    print_result 1 "Password reset request failed"
fi
echo ""

echo "======================================"
echo "19. AUTHENTICATION - REQUEST MAGIC LINK"
echo "======================================"
response=$(curl -s -X POST "$BASE_URL/auth/magic-link" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$NEW_EMAIL\"
  }")

echo "Response: $response"

if [[ $response == *"message"* ]] || [[ $response == *"success"* ]]; then
    print_result 0 "Magic link request successful (check backend console for magic link)"
else
    print_result 1 "Magic link request failed"
fi
echo ""

echo "======================================"
echo "SUMMARY"
echo "======================================"
echo "Testing completed!"
echo ""
echo "Test User Credentials:"
echo "  Email: $NEW_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo "  Access Token: ${ACCESS_TOKEN:0:50}..."
echo ""
echo "Profile Information:"
echo "  Username: $TEST_USERNAME"
echo "  Unique ID: $PROFILE_UNIQUE_ID"
echo "  Profile URL: $FRONTEND_URL/$TEST_USERNAME"
echo "  NFC URL: $FRONTEND_URL/p/$PROFILE_UNIQUE_ID"
echo ""
echo "Check your backend console for:"
echo "  - Email verification link"
echo "  - Password reset link"
echo "  - Magic link"
echo ""
echo "======================================"

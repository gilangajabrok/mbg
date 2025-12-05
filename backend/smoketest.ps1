# Smoke Test Script for User Profile Endpoints

## Prerequisites
# 1. Server must be running on http://localhost:8080
# 2. Need a valid JWT token from Supabase Auth
# 3. Need test user ID (UUID format)

$baseURL = "http://localhost:8080/api/v1"
$testUserID = "550e8400-e29b-41d4-a716-446655440000"  # Replace with real user ID
$testAdminID = "550e8400-e29b-41d4-a716-446655440001" # Replace with real admin ID

# TODO: Get real JWT token from Supabase Auth API
$jwtToken = "YOUR_JWT_TOKEN_HERE"

Write-Host "Starting User Profile Endpoint Smoke Tests..." -ForegroundColor Green
Write-Host ""

# Test 1: GET /users/me (Authenticated - Success)
Write-Host "Test 1: GET /users/me (Authenticated)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseURL/users/me" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $jwtToken" } `
        -ContentType "application/json" `
        -ErrorAction SilentlyContinue
    
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $body = $response.Content | ConvertFrom-Json
    Write-Host "✓ Response: $(($body | ConvertTo-Json -Depth 1))" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: GET /users/me (Unauthenticated - 401)
Write-Host "Test 2: GET /users/me (Unauthenticated)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseURL/users/me" `
        -Method GET `
        -ContentType "application/json" `
        -ErrorAction SilentlyContinue
    
    Write-Host "✗ Expected 401, got $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Status: 401 (Unauthorized as expected)" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed with unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: PUT /users/me (Update Profile)
Write-Host "Test 3: PUT /users/me (Update Profile)" -ForegroundColor Yellow
$updatePayload = @{
    full_name = "John Doe Updated"
    phone = "+1234567890"
    address = "123 Main St"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseURL/users/me" `
        -Method PUT `
        -Headers @{ "Authorization" = "Bearer $jwtToken" } `
        -Body $updatePayload `
        -ContentType "application/json" `
        -ErrorAction SilentlyContinue
    
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $body = $response.Content | ConvertFrom-Json
    Write-Host "✓ Updated: $($body.data.full_name)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: GET /users/:id (Admin Read)
Write-Host "Test 4: GET /users/:id (Admin Read)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseURL/users/$testAdminID" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $jwtToken" } `
        -ContentType "application/json" `
        -ErrorAction SilentlyContinue
    
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $body = $response.Content | ConvertFrom-Json
    Write-Host "✓ Profile: $($body.data.full_name)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: POST /users/:id/deactivate (Admin Deactivate)
Write-Host "Test 5: POST /users/:id/deactivate (Admin Deactivate)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseURL/users/$testAdminID/deactivate" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $jwtToken" } `
        -ContentType "application/json" `
        -ErrorAction SilentlyContinue
    
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 204) {
        Write-Host "✓ Status: 204 (No Content as expected)" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Smoke tests complete!" -ForegroundColor Green

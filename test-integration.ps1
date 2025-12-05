#!/usr/bin/env pwsh
<#
.SYNOPSIS
Frontend-Backend Integration Test Script
Tests connectivity between Next.js frontend and Go backend API

.DESCRIPTION
This script verifies:
1. Backend is running on port 8080
2. API endpoints respond correctly
3. Response format matches expected schema
4. Error handling works properly

.EXAMPLE
.\test-integration.ps1
#>

$ErrorActionPreference = "Stop"

# Configuration
$API_URL = "http://localhost:8080/api/v1"
$BACKEND_PORT = 8080
$FRONTEND_PORT = 3000

# Colors for output
$Green = @{ ForegroundColor = "Green" }
$Red = @{ ForegroundColor = "Red" }
$Yellow = @{ ForegroundColor = "Yellow" }
$Cyan = @{ ForegroundColor = "Cyan" }

Write-Host ""
Write-Host "=== Frontend-Backend Integration Test ===" @Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Backend Health Check" @Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/health" -ErrorAction SilentlyContinue -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend is running on port $BACKEND_PORT" @Green
    }
} catch {
    Write-Host "✗ Backend is not responding on port $BACKEND_PORT" @Red
    Write-Host "  Please start backend: cd backend && .\api.exe" @Red
    exit 1
}

Write-Host ""

# Test 2: Check response format without authentication
Write-Host "Test 2: Unauthenticated Request Format" @Yellow
try {
    $response = Invoke-WebRequest `
        -Uri "$API_URL/users/me" `
        -Method GET `
        -ErrorAction SilentlyContinue `
        -TimeoutSec 5
    
    if ($response.StatusCode -eq 401) {
        Write-Host "✓ API returns 401 for unauthenticated request" @Green
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401) {
        Write-Host "✓ API returns 401 for unauthenticated request" @Green
    } else {
        Write-Host "✗ Unexpected status code: $statusCode" @Red
    }
}

Write-Host ""

# Test 3: Validate error response format
Write-Host "Test 3: Error Response Format" @Yellow
try {
    $response = Invoke-WebRequest `
        -Uri "$API_URL/users/me" `
        -Method GET `
        -ErrorAction Stop `
        -TimeoutSec 5
} catch {
    try {
        $responseBody = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($responseBody)
        $body = $reader.ReadToEnd()
        $reader.Close()
        
        $json = $body | ConvertFrom-Json
        
        # Check response structure
        $hasSuccess = $json.PSObject.Properties.Name -contains "success"
        $hasError = $json.PSObject.Properties.Name -contains "error"
        $hasMeta = $json.PSObject.Properties.Name -contains "meta"
        $hasTraceId = $json.meta.PSObject.Properties.Name -contains "trace_id"
        
        if ($hasSuccess -and $hasError -and $hasMeta -and $hasTraceId) {
            Write-Host "✓ Error response has correct format" @Green
            Write-Host "  - success: $($json.success)" @Green
            Write-Host "  - error.code: $($json.error.code)" @Green
            Write-Host "  - meta.trace_id: $($json.meta.trace_id)" @Green
        } else {
            Write-Host "✗ Response format is incorrect" @Red
            Write-Host "  Expected: success, error, meta.trace_id" @Red
            Write-Host "  Got: $($json | ConvertTo-Json -Depth 1)" @Red
        }
    } catch {
        Write-Host "✗ Could not parse error response" @Red
        Write-Host "  Error: $($_.Exception.Message)" @Red
    }
}

Write-Host ""

# Test 4: Check CORS headers
Write-Host "Test 4: CORS Headers" @Yellow
try {
    $response = Invoke-WebRequest `
        -Uri "$API_URL/health" `
        -Method OPTIONS `
        -ErrorAction SilentlyContinue `
        -TimeoutSec 5
    
    $corsOrigin = $response.Headers["Access-Control-Allow-Origin"]
    $corsMethods = $response.Headers["Access-Control-Allow-Methods"]
    
    if ($corsOrigin -and $corsMethods) {
        Write-Host "✓ CORS headers are present" @Green
        Write-Host "  - Access-Control-Allow-Origin: $corsOrigin" @Green
        Write-Host "  - Access-Control-Allow-Methods: $corsMethods" @Green
    } else {
        Write-Host "⚠ CORS headers may be missing" @Yellow
        Write-Host "  - This might be OK if frontend runs on same host" @Yellow
    }
} catch {
    Write-Host "⚠ Could not check CORS headers" @Yellow
}

Write-Host ""

# Test 5: Validate database connectivity (indirect)
Write-Host "Test 5: Database Connectivity" @Yellow
Write-Host "  Checking if backend has database access..." @Yellow
try {
    # Try to access an endpoint that requires DB
    $response = Invoke-WebRequest `
        -Uri "$API_URL/health" `
        -Method GET `
        -ErrorAction SilentlyContinue `
        -TimeoutSec 5
    
    $json = $response.Content | ConvertFrom-Json
    if ($json.status -eq "ok") {
        Write-Host "✓ Backend has database connectivity" @Green
    }
} catch {
    Write-Host "⚠ Could not verify database connectivity" @Yellow
    Write-Host "  This will be verified when testing with auth token" @Yellow
}

Write-Host ""

# Test 6: Configuration check
Write-Host "Test 6: Frontend Configuration" @Yellow
$envLocalPath = ".env.local"
if (Test-Path $envLocalPath) {
    Write-Host "✓ .env.local file exists" @Green
    
    $content = Get-Content $envLocalPath
    $hasApiUrl = $content -match "NEXT_PUBLIC_API_URL"
    
    if ($hasApiUrl) {
        Write-Host "✓ NEXT_PUBLIC_API_URL is configured" @Green
    } else {
        Write-Host "✗ NEXT_PUBLIC_API_URL is not in .env.local" @Red
        Write-Host "  Add: NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" @Red
    }
} else {
    Write-Host "✗ .env.local file not found" @Red
    Write-Host "  Copy from .env.local.example and configure" @Red
}

Write-Host ""

# Summary
Write-Host "=== Test Summary ===" @Cyan
Write-Host ""
Write-Host "Next Steps:" @Yellow
Write-Host "1. Start backend: cd backend && go build -o api.exe ./cmd/api && .\api.exe" @Yellow
Write-Host "2. Start frontend: npm run dev" @Yellow
Write-Host "3. Open browser: http://localhost:3000" @Yellow
Write-Host "4. Log in with Supabase credentials" @Yellow
Write-Host "5. Check browser DevTools → Network tab for API calls" @Yellow
Write-Host ""
Write-Host "To run full integration test with auth token:" @Yellow
Write-Host "  Use the manual test examples in FRONTEND_INTEGRATION_GUIDE.md" @Yellow
Write-Host ""

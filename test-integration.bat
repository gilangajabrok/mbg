@echo off
REM Frontend-Backend Integration Test
REM Tests connectivity between Next.js frontend and Go backend

echo.
echo === Frontend-Backend Integration Test ===
echo.

REM Test 1: Check if backend is running
echo Test 1: Backend Health Check
curl -s http://localhost:8080/api/v1/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Backend is running on port 8080
) else (
    echo [FAIL] Backend is not responding
    echo Please start backend: cd backend ^&^& .\api.exe
    exit /b 1
)

echo.

REM Test 2: Check unauthenticated request (should return 401)
echo Test 2: Unauthenticated Request (expect 401)
for /f %%A in ('curl -s -w "%%{http_code}" -o nul http://localhost:8080/api/v1/users/me') do set HTTP_CODE=%%A
if "%HTTP_CODE%"=="401" (
    echo [OK] API returns 401 for unauthenticated request
) else (
    echo [FAIL] Expected 401, got %HTTP_CODE%
)

echo.

REM Test 3: Check response format
echo Test 3: Check Error Response Format
curl -s http://localhost:8080/api/v1/users/me | findstr /C:"success" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Error response contains "success" field
) else (
    echo [WARN] Could not verify response format
)

echo.

REM Test 4: Check .env.local
echo Test 4: Frontend Configuration
if exist .env.local (
    echo [OK] .env.local file exists
    findstr /C:"NEXT_PUBLIC_API_URL" .env.local >nul
    if %ERRORLEVEL% equ 0 (
        echo [OK] NEXT_PUBLIC_API_URL is configured
    ) else (
        echo [WARN] NEXT_PUBLIC_API_URL not found in .env.local
    )
) else (
    echo [WARN] .env.local file not found
    echo Copy from .env.local.example and configure
)

echo.
echo === Test Complete ===
echo.
echo Next Steps:
echo 1. Start backend: cd backend ^&^& go build -o api.exe ./cmd/api ^&^& .\api.exe
echo 2. Start frontend: npm run dev
echo 3. Open browser: http://localhost:3000
echo 4. Log in with Supabase credentials
echo 5. Check browser DevTools - Network tab for API calls
echo.

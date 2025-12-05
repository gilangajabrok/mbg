/**
 * Integration Test - Backend Connectivity
 * 
 * Usage: node test-integration.js
 * 
 * Tests if frontend can communicate with backend API
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080/api/v1';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  log('\n=== Frontend-Backend Integration Tests ===\n', 'cyan');

  let passed = 0;
  let failed = 0;

  // Test 1: Backend Health Check
  log('Test 1: Backend Health Check', 'yellow');
  try {
    const result = await httpGet(`${API_URL}/health`);
    if (result.status === 200) {
      log('✓ Backend is running on port 8080', 'green');
      passed++;
    } else {
      log(`✗ Unexpected status: ${result.status}`, 'red');
      failed++;
    }
  } catch (error) {
    log(`✗ Backend is not responding: ${error.message}`, 'red');
    log('  Please start backend: cd backend && go build -o api.exe ./cmd/api && .\\api.exe', 'red');
    failed++;
  }

  log('');

  // Test 2: Unauthenticated request (expect 401)
  log('Test 2: Unauthenticated Request (expect 401)', 'yellow');
  try {
    const result = await httpGet(`${API_URL}/users/me`);
    if (result.status === 401) {
      log('✓ API correctly returns 401 for unauthenticated request', 'green');
      passed++;
    } else {
      log(`✗ Expected 401, got ${result.status}`, 'red');
      failed++;
    }
  } catch (error) {
    log(`✗ Request failed: ${error.message}`, 'red');
    failed++;
  }

  log('');

  // Test 3: Response format
  log('Test 3: Error Response Format', 'yellow');
  try {
    const result = await httpGet(`${API_URL}/users/me`);
    const json = JSON.parse(result.data);

    const hasSuccess = 'success' in json;
    const hasError = 'error' in json;
    const hasMeta = 'meta' in json;
    const hasTraceId = json.meta && 'trace_id' in json.meta;

    if (hasSuccess && hasError && hasMeta && hasTraceId) {
      log('✓ Error response has correct format', 'green');
      log(`  - success: ${json.success}`, 'green');
      log(`  - error.code: ${json.error.code}`, 'green');
      log(`  - meta.trace_id: ${json.meta.trace_id}`, 'green');
      passed++;
    } else {
      log('✗ Response format is incorrect', 'red');
      failed++;
    }
  } catch (error) {
    log(`✗ Could not parse response: ${error.message}`, 'red');
    failed++;
  }

  log('');

  // Test 4: Frontend configuration
  log('Test 4: Frontend Configuration', 'yellow');
  const envPath = path.join(__dirname, '.env.local');
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('NEXT_PUBLIC_API_URL')) {
        log('✓ .env.local exists and has NEXT_PUBLIC_API_URL', 'green');
        const match = content.match(/NEXT_PUBLIC_API_URL=(.+)/);
        if (match) {
          log(`  Value: ${match[1]}`, 'green');
        }
        passed++;
      } else {
        log('✗ NEXT_PUBLIC_API_URL not found in .env.local', 'red');
        failed++;
      }
    } else {
      log('✗ .env.local file not found', 'red');
      log('  Copy from .env.local.example and configure', 'red');
      failed++;
    }
  } catch (error) {
    log(`✗ Could not read .env.local: ${error.message}`, 'red');
    failed++;
  }

  log('');

  // Summary
  log('=== Test Summary ===', 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('');

  if (failed === 0) {
    log('✓ All tests passed! Integration is ready.', 'green');
    log('', 'green');
    log('Next Steps:', 'yellow');
    log('1. Start backend: cd backend && .\\api.exe', 'yellow');
    log('2. Start frontend: npm run dev', 'yellow');
    log('3. Open http://localhost:3000 in browser', 'yellow');
    log('4. Log in and check DevTools Network tab for API calls', 'yellow');
    log('', 'yellow');
  } else {
    log('✗ Some tests failed. Fix issues above and try again.', 'red');
    process.exit(1);
  }
}

runTests().catch((error) => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});

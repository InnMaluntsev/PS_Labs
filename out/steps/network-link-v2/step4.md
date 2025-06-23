# Step 4: Test Your Integration

## Overview

Now that you've implemented the core endpoints, it's time to test your Network Link v2 integration thoroughly. This step ensures your service can handle real Fireblocks requests properly.

## Testing Strategy

We'll test your integration in three phases:
1. **Unit Tests** - Individual endpoint functionality
2. **Integration Tests** - Full request-response cycle with proper authentication  
3. **Stress Tests** - Performance and error handling

## Phase 1: Unit Testing

### Test Capabilities Endpoint

```javascript
const request = require('supertest');
const app = require('./your-app');

describe('GET /capabilities', () => {
  test('should return server capabilities', async () => {
    const response = await request(app)
      .get('/capabilities')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', 'test-nonce')
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(200);

    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('components');
    expect(response.body.components).toHaveProperty('accounts');
    expect(response.body.components).toHaveProperty('balances');
  });

  test('should reject requests without authentication', async () => {
    await request(app)
      .get('/capabilities')
      .expect(401);
  });
});
```

### Test Assets Endpoint

```javascript
describe('GET /capabilities/assets', () => {
  test('should return paginated assets list', async () => {
    const response = await request(app)
      .get('/capabilities/assets?limit=5')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString()) 
      .set('X-FBAPI-NONCE', 'test-nonce')
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(200);

    expect(response.body).toHaveProperty('assets');
    expect(Array.isArray(response.body.assets)).toBe(true);
    expect(response.body.assets.length).toBeLessThanOrEqual(5);
  });
});
```

### Test Accounts Endpoint

```javascript
describe('GET /accounts', () => {
  test('should return accounts list', async () => {
    const response = await request(app)
      .get('/accounts')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', 'test-nonce') 
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(200);

    expect(response.body).toHaveProperty('accounts');
    expect(Array.isArray(response.body.accounts)).toBe(true);
    
    if (response.body.accounts.length > 0) {
      const account = response.body.accounts[0];
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('title');
      expect(account).toHaveProperty('status');
    }
  });
});
```

### Test Balances Endpoint

```javascript
describe('GET /accounts/:accountId/balances', () => {
  test('should return account balances', async () => {
    const response = await request(app)
      .get('/accounts/main-account/balances')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', 'test-nonce')
      .set('X-FBAPI-SIGNATURE', 'valid-signature') 
      .expect(200);

    expect(response.body).toHaveProperty('balances');
    expect(Array.isArray(response.body.balances)).toBe(true);
    
    if (response.body.balances.length > 0) {
      const balance = response.body.balances[0];
      expect(balance).toHaveProperty('asset');
      expect(balance).toHaveProperty('total');
      expect(balance).toHaveProperty('available');
    }
  });

  test('should filter by asset type', async () => {
    const response = await request(app)
      .get('/accounts/main-account/balances?nationalCurrencyCode=USD')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', 'test-nonce')
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(200);

    expect(response.body.balances).toHaveLength(1);
    expect(response.body.balances[0].asset.nationalCurrencyCode).toBe('USD');
  });

  test('should return 404 for invalid account', async () => {
    await request(app)
      .get('/accounts/invalid-account/balances')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', 'test-nonce') 
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(404);
  });
});
```

## Phase 2: Integration Testing

### Full Authentication Flow Test

```javascript
const crypto = require('crypto');

function generateSignature(timestamp, nonce, method, endpoint, body, secretKey) {
  const prehashString = timestamp + nonce + method.toUpperCase() + endpoint + (body || '');
  return crypto
    .createHmac('sha256', secretKey)
    .update(prehashString)
    .digest('base64');
}

describe('Full Integration Tests', () => {
  const SECRET_KEY = 'your-test-secret';
  
  test('should handle complete request flow', async () => {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomUUID();
    const method = 'GET';
    const endpoint = '/capabilities';
    const signature = generateSignature(timestamp, nonce, method, endpoint, '', SECRET_KEY);

    const response = await request(app)
      .get('/capabilities')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', timestamp)
      .set('X-FBAPI-NONCE', nonce)
      .set('X-FBAPI-SIGNATURE', signature)
      .expect(200);

    expect(response.body.version).toBe('0.4.1');
  });

  test('should reject expired timestamps', async () => {
    const oldTimestamp = (Date.now() - 600000).toString(); // 10 minutes ago
    const nonce = crypto.randomUUID();
    const signature = generateSignature(oldTimestamp, nonce, 'GET', '/capabilities', '', SECRET_KEY);

    await request(app)
      .get('/capabilities')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', oldTimestamp)
      .set('X-FBAPI-NONCE', nonce)
      .set('X-FBAPI-SIGNATURE', signature)
      .expect(401);
  });
});
```

## Phase 3: Load and Error Testing

### Pagination Testing

```javascript
describe('Pagination Tests', () => {
  test('should handle large datasets with pagination', async () => {
    // Test with various limit values
    for (const limit of [1, 10, 50, 200]) {
      const response = await request(app)
        .get(`/capabilities/assets?limit=${limit}`)
        .set('X-FBAPI-KEY', 'test-key')
        .set('X-FBAPI-TIMESTAMP', Date.now().toString())
        .set('X-FBAPI-NONCE', crypto.randomUUID())
        .set('X-FBAPI-SIGNATURE', 'valid-signature')
        .expect(200);

      expect(response.body.assets.length).toBeLessThanOrEqual(limit);
    }
  });

  test('should handle startingAfter parameter', async () => {
    const response = await request(app)
      .get('/capabilities/assets?startingAfter=usdc-ethereum&limit=5')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', crypto.randomUUID())
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(200);

    // Verify pagination logic
    expect(response.body.assets).not.toContain(
      expect.objectContaining({ id: 'usdc-ethereum' })
    );
  });
});
```

### Error Handling Tests

```javascript
describe('Error Handling', () => {
  test('should return proper error format', async () => {
    const response = await request(app)
      .get('/accounts/invalid/balances')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', crypto.randomUUID())
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('errorType');
  });

  test('should handle malformed requests', async () => {
    await request(app)
      .get('/capabilities/assets?limit=invalid')
      .set('X-FBAPI-KEY', 'test-key')
      .set('X-FBAPI-TIMESTAMP', Date.now().toString())
      .set('X-FBAPI-NONCE', crypto.randomUUID())
      .set('X-FBAPI-SIGNATURE', 'valid-signature')
      .expect(400);
  });
});
```

## Integration Validation Tool

Create this validation script to test against real scenarios:

```javascript
#!/usr/bin/env node

const crypto = require('crypto');
const fetch = require('node-fetch');

class NetworkLinkValidator {
  constructor(baseUrl, apiKey, secretKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  generateHeaders(method, endpoint, body = '') {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomUUID();
    const prehash = timestamp + nonce + method.toUpperCase() + endpoint + body;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(prehash)
      .digest('base64');

    return {
      'X-FBAPI-KEY': this.apiKey,
      'X-FBAPI-TIMESTAMP': timestamp,
      'X-FBAPI-NONCE': nonce,
      'X-FBAPI-SIGNATURE': signature,
      'Content-Type': 'application/json'
    };
  }

  async testEndpoint(method, endpoint, expectedStatus = 200) {
    try {
      const headers = this.generateHeaders(method, endpoint);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers
      });

      const success = response.status === expectedStatus;
      const data = await response.json().catch(() => null);

      return {
        endpoint,
        method,
        success,
        status: response.status,
        expectedStatus,
        data,
        error: success ? null : `Expected ${expectedStatus}, got ${response.status}`
      };
    } catch (error) {
      return {
        endpoint,
        method,
        success: false,
        error: error.message
      };
    }
  }

  async runValidation() {
    console.log('🚀 Starting Network Link v2 Validation...\n');

    const tests = [
      { method: 'GET', endpoint: '/capabilities' },
      { method: 'GET', endpoint: '/capabilities/assets' },
      { method: 'GET', endpoint: '/capabilities/assets?limit=5' },
      { method: 'GET', endpoint: '/accounts' },
      { method: 'GET', endpoint: '/accounts?balances=true' },
      { method: 'GET', endpoint: '/accounts/main-account' },
      { method: 'GET', endpoint: '/accounts/main-account/balances' },
      { method: 'GET', endpoint: '/accounts/main-account/balances?nationalCurrencyCode=USD' },
      { method: 'GET', endpoint: '/accounts/invalid-account', expectedStatus: 404 }
    ];

    const results = [];
    for (const test of tests) {
      const result = await this.testEndpoint(test.method, test.endpoint, test.expectedStatus);
      results.push(result);
      
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${test.method} ${test.endpoint}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    const passed = results.filter(r => r.success).length;
    const total = results.length;

    console.log(`\n📊 Validation Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Your Network Link v2 integration is ready.');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
    }

    return results;
  }
}

// Usage
const validator = new NetworkLinkValidator(
  'http://localhost:3000',
  'your-api-key',
  'your-secret-key'
);

validator.runValidation();
```

## Manual Testing Checklist

### ✅ Basic Functionality
- [ ] `/capabilities` returns valid response with version and components
- [ ] `/capabilities/assets` returns array of supported assets
- [ ] `/accounts` returns list of accounts with proper structure
- [ ] `/accounts/{id}/balances` returns balances for valid accounts
- [ ] All endpoints return 404 for non-existent resources

### ✅ Authentication
- [ ] Requests with missing headers are rejected (401)
- [ ] Requests with invalid signatures are rejected (401)
- [ ] Requests with expired timestamps are rejected (401)
- [ ] Valid authentication allows access to all endpoints

### ✅ Pagination
- [ ] `limit` parameter controls number of returned items
- [ ] `startingAfter` parameter excludes specified item and returns following items
- [ ] `endingBefore` parameter excludes specified item and returns preceding items
- [ ] Both pagination parameters cannot be used together (returns 400)

### ✅ Error Handling
- [ ] Proper HTTP status codes for different error types
- [ ] Error responses include `message` and `errorType` fields
- [ ] No sensitive information leaked in error messages
- [ ] Malformed requests return 400 with descriptive errors

### ✅ Data Validation
- [ ] Asset filtering works for `assetId`, `nationalCurrencyCode`, `cryptocurrencySymbol`
- [ ] Account balances show correct `total`, `available`, `locked` amounts
- [ ] Asset references use proper format (nationalCurrencyCode, cryptocurrencySymbol, assetId)
- [ ] Decimal places are correctly formatted for different asset types

## Performance Testing

### Load Testing Script

```javascript
const { performance } = require('perf_hooks');

async function loadTest() {
  const CONCURRENT_REQUESTS = 100;
  const TOTAL_REQUESTS = 1000;
  
  console.log(`Starting load test: ${TOTAL_REQUESTS} requests with ${CONCURRENT_REQUESTS} concurrent`);
  
  const startTime = performance.now();
  const promises = [];
  
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const promise = fetch('http://localhost:3000/capabilities', {
      headers: {
        'X-FBAPI-KEY': 'test-key',
        'X-FBAPI-TIMESTAMP': Date.now().toString(),
        'X-FBAPI-NONCE': crypto.randomUUID(),
        'X-FBAPI-SIGNATURE': 'valid-signature'
      }
    });
    
    promises.push(promise);
    
    // Control concurrency
    if (promises.length >= CONCURRENT_REQUESTS) {
      await Promise.all(promises);
      promises.length = 0; // Clear array
    }
  }
  
  // Wait for remaining requests
  if (promises.length > 0) {
    await Promise.all(promises);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  const requestsPerSecond = (TOTAL_REQUESTS / duration) * 1000;
  
  console.log(`Load test completed:`);
  console.log(`- Total time: ${duration.toFixed(2)}ms`);
  console.log(`- Requests/second: ${requestsPerSecond.toFixed(2)}`);
}

loadTest().catch(console.error);
```

## Security Checklist

### 🔒 Authentication Security
- [ ] API keys are properly validated and not exposed in logs
- [ ] Signatures are verified using secure cryptographic methods
- [ ] Timestamp validation prevents replay attacks
- [ ] Nonce uniqueness is enforced (optional but recommended)

### 🔒 Data Security  
- [ ] No sensitive data in error messages or logs
- [ ] Input validation prevents injection attacks
- [ ] Rate limiting implemented to prevent abuse
- [ ] HTTPS enforced in production environments

### 🔒 Operational Security
- [ ] Database queries are parameterized
- [ ] Access logs capture authentication attempts
- [ ] Error monitoring alerts on unusual patterns
- [ ] Secrets are stored securely (not in code)

## Performance Benchmarks

Your implementation should meet these benchmarks:

- **Response Time**: < 200ms for balance queries
- **Throughput**: > 100 requests/second
- **Availability**: 99.9% uptime
- **Error Rate**: < 0.1% under normal load

## Ready for Production?

Before going live with Fireblocks:

1. **Complete all test scenarios** in this guide
2. **Run the validation tool** successfully  
3. **Perform load testing** with expected traffic
4. **Review security checklist** items
5. **Set up monitoring** and alerting
6. **Prepare support documentation** for your API

## 🎉 Congratulations!

You've successfully built and tested a Network Link v2 integration! Your service can now:

- ✅ Authenticate secure requests from Fireblocks
- ✅ Provide capability discovery for your services  
- ✅ Expose customer account information
- ✅ Return real-time balance data
- ✅ Handle errors gracefully with proper HTTP status codes
- ✅ Support pagination for large datasets

### Next Steps

1. **Contact Fireblocks** to register your service as a Network Link provider
2. **Implement additional endpoints** like transfers, trading, or collateral as needed
3. **Set up monitoring** to track API performance and usage
4. **Build additional features** like webhooks for real-time notifications

Your integration is now ready to connect institutional clients with your services through the Fireblocks ecosystem! 🚀
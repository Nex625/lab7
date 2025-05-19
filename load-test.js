import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },  // Ramp up to 20 users over 30s
        { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
        { duration: '30s', target: 0 },   // Ramp down to 0 users
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests must be <500ms
    http_req_failed: ['rate<0.01'],     // <1% of requests should fail
  },
};

export default function () {
  const res = http.get('https://test.k6.io'); // Replace with your application URL

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}

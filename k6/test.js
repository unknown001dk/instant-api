import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000, // Number of virtual users
  duration: '1m', // Test duration
};

export default function () {
  const url = 'http://localhost:8081/api/v1/dynamic/users-secuurewes321321/hashstartacademy1/b233bde9e155468f3c01f827c8649dd8:d4d4317ae0f4ebe032926ae940dc5de961e78d4ea9378486';

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'response body is not empty': (r) => r.body.length > 0,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1); // Pause between iterations
}

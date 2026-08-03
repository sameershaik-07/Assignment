const request = require('supertest');
const app = require('../src/server');

// Mock prisma client for unit/integration testing
jest.mock('../src/db', () => ({
  $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  item: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Health Check API', () => {
  it('GET /health should return status 200 and healthy state', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('database', 'connected');
  });

  it('GET / should return API welcome info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('documentation', '/api-docs');
  });
});

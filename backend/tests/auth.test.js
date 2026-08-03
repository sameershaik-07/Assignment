const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/db');
const bcrypt = require('bcrypt');

jest.mock('../src/db', () => ({
  $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Authentication API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and generate a unique Platform ID starting with PLT-', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'uuid-1234',
          email: data.email,
          platformId: data.platformId,
          createdAt: new Date().toISOString(),
        })
      );

      const res = await request(app).post('/api/auth/register').send({
        email: 'devops.test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.user).toHaveProperty('email', 'devops.test@example.com');
      expect(res.body.user.platformId).toMatch(/^PLT-/);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return JWT token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1234',
        email: 'devops.test@example.com',
        password: hashedPassword,
        platformId: 'PLT-ABC1234',
        createdAt: new Date().toISOString(),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'devops.test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('platformId', 'PLT-ABC1234');
    });
  });
});

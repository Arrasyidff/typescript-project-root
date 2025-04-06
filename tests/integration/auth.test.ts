import { request, createTestUser, loginTestUser } from './setup';

describe('Auth API', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };
      
      const response = await request
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });
    
    it('should not register a user with invalid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'short'
      };
      
      const response = await request
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
    });
    
    it('should not register a user with an existing email', async () => {
      // First create a user
      await createTestUser();
      
      // Try to create another user with the same email
      const userData = {
        name: 'Another User',
        email: 'test@example.com', // Same email as in createTestUser
        password: 'Password123!'
      };
      
      const response = await request
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each test
      await createTestUser();
    });
    
    it('should login a user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('email', loginData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });
    
    it('should not login a user with invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'Password123!'
      };
      
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
    
    it('should not login a user with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };
      
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user profile when authenticated', async () => {
      // Create a user and login
      await createTestUser();
      const { token } = await loginTestUser();
      
      const response = await request
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request.get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });
  
  describe('POST /api/auth/logout', () => {
    it('should logout a user', async () => {
      const response = await request.post('/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});
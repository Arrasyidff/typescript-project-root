import { request, createTestUser, loginTestUser } from './setup';

describe('User API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await createTestUser();
    userId = user.user._id;
    
    // Login to get auth token
    const loginData = await loginTestUser();
    authToken = loginData.token;
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile when authenticated', async () => {
      const response = await request
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request.get('/api/users/profile');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile when authenticated', async () => {
      const updatedData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('email', 'updated@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request
        .put('/api/users/profile')
        .send({ name: 'Hacker' });
      
      expect(response.status).toBe(401);
    });

    it('should validate update data', async () => {
      const invalidData = {
        name: '',
        email: 'not-an-email'
      };

      const response = await request
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
    });
  });

  // Admin tests - to test properly we would need to create an admin user
  describe('Admin endpoints', () => {
    // These tests would be more complete with admin authentication
    
    it('should return 403 for non-admin users trying to get all users', async () => {
      const response = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'You do not have permission to perform this action');
    });
    
    it('should return 403 for non-admin users trying to get a user by ID', async () => {
      const response = await request
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403);
    });
    
    it('should return 403 for non-admin users trying to update a user', async () => {
      const response = await request
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated By Admin' });
      
      expect(response.status).toBe(403);
    });
    
    it('should return 403 for non-admin users trying to delete a user', async () => {
      const response = await request
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403);
    });
  });
});
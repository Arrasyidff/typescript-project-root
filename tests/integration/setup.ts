import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from '../../src/config';
import { app } from '../../src/app';
import supertest from 'supertest';

let mongoServer: MongoMemoryServer;

// Setup before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  console.log(`MongoDB successfully connected to ${mongoUri}`);
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('MongoDB connection closed');
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Export supertest instance for API testing
export const request = supertest(app);

// Export test utility functions
export const createTestUser = async (userData: any = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mergedUser = { ...defaultUser, ...userData };
  
  const response = await request
    .post('/api/auth/register')
    .send(mergedUser);
  
  return response.body;
};

export const loginTestUser = async (credentials: any = {}) => {
  const defaultCredentials = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mergedCredentials = { ...defaultCredentials, ...credentials };

  const response = await request
    .post('/api/auth/login')
    .send(mergedCredentials);
  
  return response.body;
};
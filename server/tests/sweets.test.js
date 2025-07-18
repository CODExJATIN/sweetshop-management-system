const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Sweet = require('../models/Sweet');

// Connect to the test database before running any tests
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweetshop_test');
});

// Clean up the database and close the connection after all tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

// Remove all sweets after each test to ensure test isolation
afterEach(async () => {
  await Sweet.deleteMany();
});

// test: add sweets
describe('POST /api/sweets', () => {
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/sweets').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/validation/i);
  });

  it('should return 400 if price is not a number', async () => {
    const invalidSweet = {
      name: 'Barfi',
      category: 'Milk-Based',
      price: 'fifty',
      quantity: 10
    };

    const res = await request(app).post('/api/sweets').send(invalidSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/validation/i);
  });

  it('should return 400 if quantity is negative', async () => {
    const invalidSweet = {
      name: 'Peda',
      category: 'Milk-Based',
      price: 15,
      quantity: -5
    };

    const res = await request(app).post('/api/sweets').send(invalidSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/validation/i);
  });

  it('should ignore unknown fields', async () => {
    const sweetWithExtra = {
      name: 'Rasgulla',
      category: 'Milk-Based',
      price: 25,
      quantity: 30,
      madeByAliens: true
    };

    const res = await request(app).post('/api/sweets').send(sweetWithExtra);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).not.toHaveProperty('madeByAliens');
  });

  it('should create a new sweet', async () => {
    // Define a new sweet object
    const newSweet = {
      name: 'Kaju Katli',
      category: 'Nut-Based',
      price: 50,
      quantity: 20,
    };

    // Send POST request to create the sweet
    const res = await request(app).post('/api/sweets').send(newSweet);

    // Assert the response
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Kaju Katli');
    expect(res.body.data.price).toBe(50);
  });
});


// test : View Sweets
describe('GET /api/sweets', () => {
  it('should return an array of all sweets', async () => {
    // Insert sample sweets into DB
    const sweet1 = {
      name: 'Kaju Katli',
      category: 'Nut-Based',
      price: 50,
      quantity: 20
    };

    const sweet2 = {
      name: 'Gulab Jamun',
      category: 'Milk-Based',
      price: 10,
      quantity: 50
    };

    // Create two sweets in the database
    await request(app).post('/api/sweets').send(sweet1);
    await request(app).post('/api/sweets').send(sweet2);

    // Send GET request to fetch all sweets
    const res = await request(app).get('/api/sweets');

    // Assert the response contains both sweets
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[1].category).toBe('Milk-Based');
  });
});

// test: Delete Sweets
describe('DELETE /api/sweets/:id', () => {
  it('should delete the sweet by ID', async () => {
    // First, add a sweet
    const sweet = {
      name: 'Gulab Jamun',
      category: 'Milk-Based',
      price: 10,
      quantity: 50
    };

    const addRes = await request(app).post('/api/sweets').send(sweet);
    const sweetId = addRes.body.data._id;

    // Now delete it
    const res = await request(app).delete(`/api/sweets/${sweetId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Sweet deleted successfully.');

    // Confirm deletion
    const fetchRes = await request(app).get('/api/sweets');
    expect(fetchRes.body.data.length).toBe(0);
  });

  it('should return 400 for invalid ObjectId', async () => {
    const res = await request(app).delete('/api/sweets/invalid-id-123');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });

  it('should return 404 if sweet does not exist', async () => {
    const fakeId = '64a06fa2ebd02f6a22993a61'; 
    const res = await request(app).delete(`/api/sweets/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Sweet not found.');
  });
});

// test: Search Sweets
describe('GET /api/sweets/search', () => {
  beforeEach(async () => {
    await Sweet.insertMany([
      { name: 'Rasgulla', category: 'Milk-Based', price: 25, quantity: 10 },
      { name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
      { name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 30 },
    ]);
  });

  // Search by Name
  it('should return sweets matching name (case-insensitive)', async () => {
    const res = await request(app).get('/api/sweets/search?name=rasgulla');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name.toLowerCase()).toContain('rasgulla');
  });

  // Search by Category
  it('should return sweets matching category (case-insensitive)', async () => {
    const res = await request(app).get('/api/sweets/search?category=milk-based');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].category.toLowerCase()).toBe('milk-based');
  });

  // Search by Price Range
  it('should return sweets within the given price range', async () => {
    const res = await request(app).get('/api/sweets/search?min=10&max=30');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2); // Rasgulla (25), Gulab Jamun (10)
  });

  // Combined Query (name + category)
  it('should allow combined queries (e.g., name + category)', async () => {
    const res = await request(app).get('/api/sweets/search?name=jamun&category=milk-based');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name.toLowerCase()).toContain('jamun');
  });

  // Invalid price values
  it('should return 400 if price values are not numbers', async () => {
    const res = await request(app).get('/api/sweets/search?min=cheap&max=expensive');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/min and max should be valid numbers/i);
  });

  // Invalid price logic (min > max)
  it('should return 400 if min > max', async () => {
    const res = await request(app).get('/api/sweets/search?min=100&max=10');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/min cannot be greater than max/i);
  });

  // No matching sweets
  it('should return empty array if no match is found', async () => {
    const res = await request(app).get('/api/sweets/search?name=laddu');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  // No query at all
  it('should return 400 if no query parameter is provided', async () => {
    const res = await request(app).get('/api/sweets/search');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/at least one query param.*required/i);
  });
});


// test : Purchase Sweets
describe('POST /api/sweets/:id/purchase', () => {
  let sweetId;

  beforeEach(async () => {
    const res = await request(app).post('/api/sweets').send({
      name: 'Kaju Katli',
      category: 'Nut-Based',
      price: 50,
      quantity: 20,
    });
    sweetId = res.body.data._id;
  });

  it('should reduce quantity when purchase is successful', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(15);
  });

  it('should return 400 if quantity is not provided', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/quantity is required/i);
  });

  it('should return 422 if quantity is negative or zero', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: -3 });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/must be a positive number/i);
  });

  it('should return 400 if ObjectId is invalid', async () => {
    const res = await request(app)
      .post(`/api/sweets/invalid-id/purchase`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });

  it('should return 404 if sweet does not exist', async () => {
    const nonExistentId = '64a0ccf8bcf86cd799439011';
    const res = await request(app)
      .post(`/api/sweets/${nonExistentId}/purchase`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Sweet not found.');
  });

  it('should return 400 if not enough stock is available', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not enough stock/i);
  });
});


// test: restock sweets
describe('POST /api/sweets/:id/restock', () => {
  let sweetId;

  beforeEach(async () => {
    const res = await request(app).post('/api/sweets').send({
      name: 'Barfi',
      category: 'Milk-Based',
      price: 20,
      quantity: 10,
    });
    sweetId = res.body.data._id;
  });

  it('should increase quantity when restock is successful', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(15);
  });

  it('should return 400 if quantity is missing', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/quantity is required/i);
  });

  it('should return 422 if quantity is not a positive number', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .send({ quantity: 0 });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/positive number/i);
  });

  it('should return 400 for invalid ObjectId', async () => {
    const res = await request(app)
      .post('/api/sweets/invalid-id/restock')
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });

  it('should return 404 if sweet not found', async () => {
    const fakeId = '64a0ccf8bcf86cd799439011';
    const res = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Sweet not found.');
  });
});

//test : sorting sweets
describe('GET /api/sweets - sorting', () => {
  beforeEach(async () => {
    const sweets = [
      { name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
      { name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 },
      { name: 'Rasgulla', category: 'Milk-Based', price: 30, quantity: 15 },
    ];
    await Sweet.insertMany(sweets);
  });

  it('should sort sweets by price in ascending order', async () => {
    const res = await request(app).get('/api/sweets?sortBy=price&order=asc');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const prices = res.body.data.map(s => s.price);
    expect(prices).toEqual([10, 30, 50]);
  });

  it('should sort sweets by name in descending order', async () => {
    const res = await request(app).get('/api/sweets?sortBy=name&order=desc');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const names = res.body.data.map(s => s.name);
    expect(names).toEqual(['Rasgulla', 'Kaju Katli', 'Gulab Jamun'].sort().reverse());
  });

  it('should return 400 if sortBy field is invalid', async () => {
    const res = await request(app).get('/api/sweets?sortBy=invalidField');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid sortBy field/i);
  });

  it('should return 400 if order is invalid', async () => {
    const res = await request(app).get('/api/sweets?sortBy=price&order=random');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid order value/i);
  });
});






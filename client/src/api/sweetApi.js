import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/sweets';

// Get all sweets
export const getAllSweets = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

// Add a new sweet
export const addSweet = async (sweet) => {
  const res = await axios.post(BASE_URL, sweet);
  return res.data.data;
};

// Delete a sweet by ID
export const deleteSweet = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data.data;
};

// Purchase sweet
export const purchaseSweet = async (id, quantity) => {
  console.log("quantity",quantity)
  const res = await axios.post(`${BASE_URL}/${id}/purchase`, { quantity });
  return res.data.data;
};

// Restock sweet
export const restockSweet = async (id, quantity) => {
  const res = await axios.post(`${BASE_URL}/${id}/restock`, { quantity });
  return res.data.data;
};

// Search sweets by name, category or price range
export const searchSweets = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${BASE_URL}/search?${params}`);
  return res.data.data;
};

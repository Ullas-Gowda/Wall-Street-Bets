// In-memory data stores for development/testing without MongoDB
export const users = new Map();
export const portfolios = new Map();
export const transactions = [];

export const resetMemoryDB = () => {
  users.clear();
  portfolios.clear();
  transactions.length = 0;
};

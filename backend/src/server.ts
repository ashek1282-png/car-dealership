import app from './app.js';
import { seedDatabase } from './shared/seed/seedDatabase.js';

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('[seed] Failed to seed database:', error);
  }
  app.listen(PORT, () => {
    console.log(`Car Dealership API listening on http://localhost:${PORT}`);
  });
};

start();

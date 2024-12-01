// routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/Users';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(Users);
  try {
    const users = await userRepository.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send(err);
  }
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(Users);
  const { username, email } = req.body;
  const user = userRepository.create({ username, email });

  try {
    await userRepository.save(user);
    res.status(201).send('User created.');
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send(err);
  }
});

export default router;

import express, { Request, Response } from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (request: Request, response: Response) => {
  const users = await prisma.user.findMany({
    include: {
      posts: true
    }
  });

  return response.status(200).json(users);
});

app.post('/users', async (request: Request, response: Response) => {
  const {name, email, posts} =  request.body;

  const emailExist = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(emailExist) {
    return response.status(400).json({message: `email already exist`});
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      posts,
    }
  })

  return response.status(201).json(user);
})

app.listen(3000, () => console.log(`http://localhost:3000`));

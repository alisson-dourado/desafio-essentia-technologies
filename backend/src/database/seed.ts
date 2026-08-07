import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);

  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('Seed user credentials are not configured');
  }

  const existingUser = await usersService.findByEmail(email);

  if (!existingUser) {
    await usersService.create(email, password);
    console.log(`User ${email} created`);
  } else {
    console.log(`User ${email} already exists`);
  }

  await app.close();
}

void bootstrap();

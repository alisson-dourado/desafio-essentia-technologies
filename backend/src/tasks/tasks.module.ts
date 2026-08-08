import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';
import { TaskHistoryModule } from '../task-history/task-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule, TaskHistoryModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

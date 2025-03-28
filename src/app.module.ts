import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [UsersModule, AuthModule, PointsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

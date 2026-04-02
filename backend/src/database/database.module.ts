import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { ContactRequestEntity } from './entities/contact-request.entity';

const databaseImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [TypeOrmModule.forFeature([ContactRequestEntity])];

@Module({
  imports: [...databaseImports],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

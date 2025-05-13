import { Module } from '@nestjs/common';
import { ReceitaService } from './receitas.service';
import { ReceitaController } from './receitas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';
import { Receitas } from 'src/database/entities/receitas/receita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receitas, User])],
  controllers: [ReceitaController],
  providers: [ReceitaService, UsersService],
  exports: [ReceitaService, UsersService],
})
export class ReceitaModule {}

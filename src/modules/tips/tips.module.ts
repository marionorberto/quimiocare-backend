import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tips } from 'src/database/entities/tips/tips.entity';
import { TipsCategory } from 'src/database/entities/tips_category/tips_category.entity';
import { TipsCategoryService } from '../tips-category/tips-category.service';
@Module({
  imports: [TypeOrmModule.forFeature([Tips, TipsCategory])],
  controllers: [TipsController],
  providers: [TipsService, TipsCategoryService],
  exports: [TipsService, TipsCategoryService],
})
export class TipsModule {}

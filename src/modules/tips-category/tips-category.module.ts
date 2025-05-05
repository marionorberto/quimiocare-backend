import { Module } from '@nestjs/common';
import { TipsCategoryService } from './tips-category.service';
import { TipsCategoryController } from './tips-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipsCategory } from 'src/database/entities/tips_category/tips_category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TipsCategory])],
  controllers: [TipsCategoryController],
  providers: [TipsCategoryService],
  exports: [TipsCategoryService],
})
export class TipsCategoryModule {}

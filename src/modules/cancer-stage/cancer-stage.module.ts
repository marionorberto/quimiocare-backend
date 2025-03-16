import { Module } from '@nestjs/common';
import { CancerStageService } from './cancer-stage.service';
import { CancerStageController } from './cancer-stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipsCategoryService } from '../tips-category/tips-category.service';
import { CancerType } from 'src/database/entities/cancer-types/cancer-types.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CancerType])],
  controllers: [CancerStageController],
  providers: [CancerStageService, TipsCategoryService],
  exports: [CancerStageService, TipsCategoryService],
})
export class CancerStageModule {}

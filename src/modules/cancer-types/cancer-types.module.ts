import { Module } from '@nestjs/common';
import { CancertypesService } from './cancer-types.service';
import { CancertypesController } from './cancer-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipsCategoryService } from '../tips-category/tips-category.service';
import { CancerType } from 'src/database/entities/cancer-types/cancer-types.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CancerType])],
  controllers: [CancertypesController],
  providers: [CancertypesService, TipsCategoryService],
  exports: [CancertypesService, TipsCategoryService],
})
export class CancerTypesModule {}

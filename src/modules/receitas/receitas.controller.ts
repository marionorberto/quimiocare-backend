import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReceitaService } from './receitas.service';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateReceitaDto } from './dtos/create-receita.dto';
import { UpdateReceitaDto } from './dtos/update-receita.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('receitas')
export class ReceitaController {
  constructor(private receitaService: ReceitaService) {}
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.receitaService.findAll(request);
  }

  @Get('receita/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.receitaService.findByPk(id);
  }

  @Post('create/receita')
  async create(
    @Body() createReceitaDto: CreateReceitaDto,
    @Req() request: Request,
  ) {
    return await this.receitaService.create(createReceitaDto, request);
  }

  @Put('update/receita/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateReceitaDto: UpdateReceitaDto,
  ) {
    return await this.receitaService.updateOne(id, updateReceitaDto);
  }

  @Delete('delete/receita/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.receitaService.deleteOne(id);
  }
}

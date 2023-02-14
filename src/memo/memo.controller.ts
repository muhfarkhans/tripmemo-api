import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private memoService: MemoService) {}

  @Get()
  all(@Query('q') q?: string) {
    return this.memoService.all(q);
  }

  @Get('offset')
  paginateOffset(
    @Query('page') page: string,
    @Query('take') take: string,
    @Query('q') q?: string,
  ) {
    return this.memoService.getPaginateOffset({
      page: parseInt(page) || 1,
      take: parseInt(take) || 10,
      q,
    });
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.memoService.find(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/memo',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
          callback(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateMemoDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    console.log(dto);
    console.log(file);

    return this.memoService.create(dto, file.filename, user.id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Body() dto: UpdateMemoDto,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    console.log(dto);

    return this.memoService.update(dto, id, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.memoService.delete(id, user.id);
  }
}

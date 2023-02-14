import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';

@Injectable()
export class MemoService {
  constructor(private prisma: PrismaService) {}

  async all(q?: string) {
    const memo = await this.prisma.memo.findMany({
      where: {
        title: {
          contains: q,
        },
      },
    });

    return memo;
  }

  async getPaginateOffset(params: {
    page?: number;
    take?: number;
    q?: string;
  }) {
    const { page, take, q } = params;
    let skip = page;
    if (page == 1) skip = 0;

    const totalMemo = await this.prisma.memo.count({
      where: {
        title: {
          contains: q,
        },
      },
    });

    const memo = await this.prisma.memo.findMany({
      where: {
        title: {
          contains: q,
        },
      },
      skip,
      take,
    });

    return {
      items: memo,
      meta: {
        itemCount: memo.length,
        totalItems: totalMemo,
        itemsPerPage: take,
        totalPages: Math.ceil(totalMemo / take),
        currentPage: page,
      },
    };
  }

  async find(memoId: number) {
    const memo = await this.prisma.memo.findUnique({
      where: {
        id: memoId,
      },
    });

    return memo;
  }

  async create(dto: CreateMemoDto, photo: string, userId: number) {
    const memo = await this.prisma.memo.create({
      data: {
        locationName: dto.locationName,
        title: dto.title,
        detail: dto.detail,
        googleMapLink: dto.googleMapLink,
        visibility: dto.visibility,
        userId: userId,
        photo: photo,
      },
    });

    return memo;
  }

  async update(dto: UpdateMemoDto, memoId: number, userId: number) {
    const memo = await this.prisma.memo.updateMany({
      where: {
        id: memoId,
        userId: userId,
      },
      data: {
        locationName: dto.locationName,
        title: dto.title,
        detail: dto.detail,
        googleMapLink: dto.googleMapLink,
        visibility: dto.visibility,
      },
    });

    return memo;
  }

  async delete(memoId: number, userId: number) {
    const memo = await this.prisma.memo.deleteMany({
      where: {
        id: memoId,
        userId: userId,
      },
    });

    return memo;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }


  @UseGuards(AuthGuard)
  @Post('make/:id')
  makeFavorite(@Param('id') id: string, @Req() req) {

    return this.favoritesService.makeFavorite(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('undo/:id')
  makeUnFavorite(@Param('id') id: string, @Req() req) {

    return this.favoritesService.makeUnFavorite(+id, req.user.sub);
  }



  @UseGuards(AuthGuard)
  @Get('files')
  findFavoriteFiles(@Query('searchTerm') searchTerm: string, @Req() req) {

    return this.favoritesService.findFavoriteFiles(searchTerm, req.user.sub);
  }



}

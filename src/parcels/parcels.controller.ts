import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './parcels.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Parcels } from './parcels.entity';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-auth-decorator';

@UseGuards(AuthGuard())
@Controller('parcels')
export class ParcelsController {
  constructor(private userService: UsersService) {}


  @Get()
  Get(): Promise<Parcels[]> {
    return this.userService.getParcel();
  }

  @Post()
  Post(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User): Promise<Parcels> {
    return this.userService.postParcel(createOrderDto, user);
  }

  @Post('/order')
  CreateOrder(@Body() createParcelsDto: CreateParcelDto): Promise<Parcels[]> {
    return this.userService.createParcel(createParcelsDto);
  }

  @Post('/label')
  CreateLabel(@Body() createParcelsDto: CreateParcelDto) {
    return this.userService.createLabel(createParcelsDto);
  }

  @Post('/protocol')
  CreateProtocol(@Body() createParcelsDto: CreateParcelDto) {
    return this.userService.createProtocol(createParcelsDto);
  }
}

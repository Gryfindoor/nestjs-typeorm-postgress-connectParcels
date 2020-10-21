import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DOMParser } from 'xmldom';
import { Parcels } from './parcels.entity';
import { ParcelsRepository } from './parcels.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cron } from '@nestjs/schedule';
import { TaskStatus } from './parcels-entity.enum';
import { infoService } from './xml/info-serviceXml';
import { createParcel } from './xml/create-parcelsXml';
import { createLabel } from './xml/create-labelsXml';
import { Base64 } from 'js-base64';
import { writeFile } from 'fs';
import { createProtocol } from './xml/create-protocolsXml';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(ParcelsRepository)
    private parcelsRepository: ParcelsRepository,
  ) {}

  
  async createProtocol(createParcelsDto: CreateParcelDto) {
    return this.parcelsRepository.createProtocol(createParcelsDto);
  }

  async createLabel(createParcelsDto: CreateParcelDto) {
    return this.parcelsRepository.createLabel(createParcelsDto);
  }

  async createParcel(createParcelsDto: CreateParcelDto): Promise<Parcels[]> {
    return this.parcelsRepository.createParcel(createParcelsDto);
  }


  async postParcel(createOrderDo: CreateOrderDto, user: User): Promise<Parcels> {
    return this.parcelsRepository.postParcel(createOrderDo, user);
  }
  async getParcel(): Promise<Parcels[]> {
    return this.parcelsRepository.updateParcelAutomaty();
  }

  

  // @Cron('*/30 * * * * *')
  // runEvery10Seconds() {
  //   this.parcelsRepository.updateParcelAutomaty().then(res => {
  //     const datalength = res.length;
  //     for (let x = 0; x < datalength; x++) {
  //       const { id } = res[x];
  //       infoService(res[x].waybill)
  //         .then(res => {
  //           const newXml = new DOMParser().parseFromString(res, 'text/xml');
  //           const find = newXml.getElementsByTagName('description')[0]
  //             .childNodes[0].nodeValue;
  //           const user = new Parcels();
  //           user.id = id;
  //           user.trackStatus = find;
  //           if (find === 'Przesyłka doręczona ') {
  //             user.status = TaskStatus.DONE;
  //           } else {
  //             user.status = TaskStatus.IN_PROGRESS;
  //           }
  //           Parcels.update(id, user);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     }
  //   });
  // }
}

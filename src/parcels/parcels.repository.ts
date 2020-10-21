import { EntityRepository, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Parcels } from './parcels.entity';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { createParcel } from './xml/create-parcelsXml';
import { TaskStatus } from './parcels-entity.enum';
import { DOMParser } from 'xmldom';
import { Base64 } from 'js-base64';
import { writeFile } from 'fs';
import { createLabel } from './xml/create-labelsXml';
import { createProtocol } from './xml/create-protocolsXml';
import { BadRequestException, Logger } from '@nestjs/common';
import { User } from 'src/auth/auth.entity';

@EntityRepository(Parcels)
export class ParcelsRepository extends Repository<Parcels> {
  async postParcel(createOrderDto: CreateOrderDto, user: User): Promise<Parcels> {
    const {
      company,
      address,
      postalCode,
      city,
      name,
      phone,
      endDate,

    } = createOrderDto;

    const parcel = new Parcels();
    parcel.company = company;
    parcel.address = address;
    parcel.postalCode = postalCode;
    parcel.city = city;
    parcel.name = name;
    parcel.phone = phone;
    parcel.endDate = endDate;
    parcel.user = user;
    await parcel.save();

    delete parcel.user;

    return parcel;
  }

  async updateParcelAutomaty() {
    const find = await Parcels.find({ where: { status: 'IN_PROGRESS' } });
    return find;
  }

  async createProtocol(createParcelDto: CreateParcelDto) {
    const findParcel = await Parcels.find({
      where: { id: In(createParcelDto.id) },
    });
    let elementId = '';
    for (let x = 0; x < findParcel.length; x++) {
      const { parcelId } = findParcel[x];
      if(!parcelId){
        throw new BadRequestException(`Parcel not create id:${findParcel[x].id}`)
      }
      const element = `<packages><parcels><parcelId>${parcelId}</parcelId></parcels></packages>`;
      elementId += element;
    }
    await createProtocol(elementId).then(res => {
      const newXml = new DOMParser().parseFromString(res, 'text/xml');

      const find = newXml.getElementsByTagName('documentData')[0].childNodes[0]
        .nodeValue;
        console.log(find);
      const bin = Base64.atob(find);
      writeFile('result_protocol.pdf', bin, 'binary', error => {
        if (error) {
          throw error;
        } else {
          console.log('protocol saved!');
        }
      });
    });
  }

  async createLabel(createParcelDto: CreateParcelDto) {
    const findParcel = await Parcels.find({
      where: { id: In(createParcelDto.id) },
    });
    console.log(findParcel)
    let elementId = '';
    for (let x = 0; x < findParcel.length; x++) {
       const  { parcelId } = await findParcel[x];
      if(!parcelId){
        throw new BadRequestException(`Parcel not create id:${findParcel[x].id}`)
      }
      const element = `<packages><parcels><parcelId>${parcelId}</parcelId></parcels></packages>`;
      elementId += element;
    }
    await createLabel(elementId).then(res => {
      const newXml = new DOMParser().parseFromString(res, 'text/xml');
      const find = newXml.getElementsByTagName('documentData')[0].childNodes[0]
        .nodeValue;
      const bin = Base64.atob(find);
      writeFile('result_lagel.pdf', bin, 'binary', error => {
        if (error) {
          throw error;
        } else {
          console.log('binary saved!');
        }
      });
    });
  }

  async createParcel(createParcelDto: CreateParcelDto): Promise<Parcels[]> {
    const findParcel = await Parcels.find({
      where: { id: In(createParcelDto.id) },
    });
  
    for (let x = 0; x < findParcel.length; x++) {
      const {
        status,
        company,
        address,
        postalCode,
        city,
        name,
        phone,
        id,
      } = findParcel[x];

      await createParcel(
        company,
        address,
        postalCode,
        city,
        name,
        phone,
        '',
      ).then(res => {
        if (status == 'OPEN') {
          const parcelXML = new DOMParser().parseFromString(res, 'text/xml');
          const update = new Parcels();
          update.waybill = parcelXML.getElementsByTagName(
            'waybill',
          )[0].childNodes[0].nodeValue;
          update.parcelId = parcelXML.getElementsByTagName(
            'parcelId',
          )[0].childNodes[0].nodeValue;
          update.status = TaskStatus.IN_PROGRESS;

          Parcels.update(id, update);
        }
      });
    }
    return;
  }
}

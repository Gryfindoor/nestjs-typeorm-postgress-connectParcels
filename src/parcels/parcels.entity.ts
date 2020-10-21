import { User } from 'src/auth/auth.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TaskStatus } from './parcels-entity.enum';

@Entity()
@Unique(['waybill'])
export class Parcels extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  address: string;

  @Column()
  postalCode: string;

  @Column()
  city: string;

  @Column()
  name: string;

  @Column()
  phone: number;

  @Column({default: null})
  parcelId: string;

  @Column({default: null})
  waybill: string;

  @Column({ default: null })
  trackStatus: string;

  @Column({ default: TaskStatus.OPEN })
  status: TaskStatus;

  @Column({ default: new Date() })
  startDate: Date;

  @Column()
  endDate: Date;


  @ManyToOne(type => User, user => user.parcel, {eager: false})
  user: User;

}

import { Parcels } from 'src/parcels/parcels.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;


  @OneToMany(type => Parcels, parcel => parcel.user, {eager: true})
  parcel: Parcels[];

  async validatePassword(password: string): Promise<boolean>{
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
 }
}

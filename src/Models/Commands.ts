import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from "typeorm";
import { Product } from "./Products";



@Entity()
export class Command extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: number;

    @Column()
    date: Date;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];



}
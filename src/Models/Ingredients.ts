import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { Product } from "./Products";



@Entity()
export class Ingredient extends BaseEntity {
    static findAll(arg0: { where: { id: string; }; }) {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    stock: number;

    @ManyToMany(() => Product)
    @JoinTable({ name: "products_has_ingredients" })
    products: Product[];


}
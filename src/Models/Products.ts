import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { Ingredient } from "./Ingredients";
import { Command } from "./Commands";



@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    prix: number;

    @ManyToMany(() => Ingredient)
    @JoinTable({ name: "products_has_ingredients" })
    ingredients: Ingredient[];

    @ManyToMany(() => Command)
    @JoinTable()
    commands: Command[];


}
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
    USER = 'user',
    CUISINE = 'cuisine',
    ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;


}
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'demo_requests' })
@Index('demo_requests_created_at_idx', ['created_at'])
export class ContactRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 120,
  })
  full_name!: string;

  @Column({
    type: 'varchar',
    length: 320,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 120,
  })
  country!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  message!: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at!: Date;
}

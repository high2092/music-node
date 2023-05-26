import { getLastSequence } from '../../utils/encoding';

interface Entity {
  id?: number;
}

export class Repository<T extends Entity> {
  sequence: number;
  entities: Record<number, T>;

  constructor() {
    this.sequence = 1;
    this.entities = {};
  }

  findAll() {
    return this.entities;
  }

  save(entity: T) {
    entity.id ??= this.sequence++;
    this.entities[entity.id] = entity;
  }

  findById(id: number) {
    return this.entities[id];
  }

  deleteById(id: number) {
    delete this.entities[id];
  }

  load(entities: Record<number, T>) {
    this.entities = { ...entities };
    this.sequence = getLastSequence(entities) + 1;
  }
}

import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: any

  get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }

  public equals(entity: Entity<any>) {
    if(entity == this){
      return true
    }

    if (entity.id === this.id){
      return true
    }
  }
}

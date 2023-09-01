import { AggregateRoot } from '@/core/entities/agregate-root'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updateAt?: Date
}

export abstract class Comment<Props extends CommentProps> extends AggregateRoot<Props> {
  get content(): string {
    return this.props.content
  }

  get authorId(): string {
    return this.props.authorId
  }

  get createdAt(): string {
    return this.props.createdAt
  }

  get updateAt(): string {
    return this.props.updateAt
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }
}

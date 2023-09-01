import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/agregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'


export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachments: AnswerAttachmentList
  createdAt: Date
  updateAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get authorId(): string {
    return this.props.authorId
  }

  get questionId(): string {
    return this.props.questionId
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments
  }

  get createdAt(): string {
    return this.props.createdAt
  }

  get updateAt(): string {
    return this.props.updateAt
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }
  

  private touch() {
    this.props.updateAt = new Date()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new AnswerAttachmentList([]),
      },
      id,
    )
    
    const isNewAnswer = !id
    
    if(isNewAnswer){
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}

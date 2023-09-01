import { AggregateRoot } from '@/core/entities/agregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  title: string
  content: string
  slug: Slug
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  attachments: QuestionAttachmentList
  createdAt: Date
  updateAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title(): string {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug(): string {
    return this.props.slug.value
  }

  get authorId(): string {
    return this.props.authorId
  }

  get bestAnswerId(): string {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if(bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updateAt(): string {
    return this.props.updateAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'day') <= 3
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )

    return question
  }
}

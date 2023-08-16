import dayjs from "dayjs";
import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Slug } from "./value-objects/slug";

interface QuestionProps {
  title: string;
  content: string;
  slug: Slug;
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  createdAt: Date;
  updateAt?: Date;
}

export class Question extends Entity<QuestionProps>{
  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get slug(): string {
    return this.props.slug;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get bestAnswerId(): string {
    return this.props.bestAnswerId;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updateAt(): string {
    return this.props.updateAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'day') <= 3
  }

  get excerpt(): string {
    return this.content
    .substring(0, 120)
    .trimEnd()
    .concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerod(bestAnswerId: UniqueEntityId) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityId) {
    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      createdAt: new Date(),
    }, id)

    return question
  }
}
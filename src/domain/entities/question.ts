import { randomUUID } from "crypto";

interface QuestionProps {
  title: string;
  content: string;
  slug: string;
  authorId: string;
}

export class Question {
  public id: string;
  public title: string;
  public slug: string;
  public content: string;
  public authorId: string;

  constructor(props: QuestionProps, id?: string) {
    const { title, content, authorId, slug } = props;

    this.title = title;
    this.slug = slug;
    this.content = content;
    this.authorId = authorId;
    this.id = id ?? randomUUID();
  }	
}
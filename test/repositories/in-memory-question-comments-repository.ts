import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {  
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(questionComment => questionComment.id.toString() == id)

    if(! questionComment){
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string , {page}: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = this.items.
    filter(answer => answer.questionId.toString() == questionId)
    .slice(((page - 1) * 20), page * 20)

    return questionComments

  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == questionComment.id)

    this.items.splice(itemIndex, 1)
  }
}
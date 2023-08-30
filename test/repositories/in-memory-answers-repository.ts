import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {

  constructor (private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find(answer => answer.id.toString() == id)

    if(! answer){
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string , {page}: PaginationParams): Promise<Answer[]> {
    const answers = this.items.
    filter(answer => answer.questionId.toString() == questionId)
    .slice(((page - 1) * 20), page * 20)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == answer.id)

    this.items.splice(itemIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == answer.id)

    this.items[itemIndex] = answer
  } 
}
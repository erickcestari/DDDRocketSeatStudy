import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {

  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find(answer => answer.id.toString() == id)

    if(! answer){
      return null
    }

    return answer
  }

  findManyByQuestionId(questionId: string , {page}: PaginationParams): Promise<Answer[]> {
    const answers = this.items.
    filter(answer => answer.questionId.toString() == questionId)
    .slice(((page - 1) * 20), page * 20)

    return Promise.resolve(answers)

  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == answer.id)

    this.items.splice(itemIndex, 1)
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == answer.id)

    this.items[itemIndex] = answer
  } 
}
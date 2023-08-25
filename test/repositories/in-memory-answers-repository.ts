import { AnswersRepository } from "@/domain/forum/application/repositories/answers-respository";
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

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id == answer.id)

    this.items.splice(itemIndex, 1)
  }
}
import { AnswersRepository } from "../repositories/answers-respository"

interface DeleteUseCaseRequest {
  authorId: string
  answerId: string
}

interface DeleteUseCaseResponse {

}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId
  }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if(authorId != answer.authorId.toString()) {
      throw new Error('You are not the author of this answer')
    }

    await this.answersRepository.delete(answer)
    
    return {}
  }
}

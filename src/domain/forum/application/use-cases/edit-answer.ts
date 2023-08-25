import { AnswersRepository } from '../repositories/answers-repository'

interface EditUseCaseRequest {
  authorId: string
  content: string
  answerId: string
}

interface EditUseCaseResponse {

}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    content,
    answerId
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if(authorId != answer.authorId.toString()) {
      throw new Error('You are not the author of this answer')
    }

    answer.content = content

    await this.answersRepository.save(answer)
    
    return {}
  }
}

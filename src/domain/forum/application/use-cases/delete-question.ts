import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteUseCaseRequest {
  authorId: string
  questionId: string
}

interface DeleteUseCaseResponse {

}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId
  }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if(authorId != question.authorId.toString()) {
      throw new Error('You are not the author of this question')
    }

    await this.questionsRepository.delete(question)
    
    return {}
  }
}

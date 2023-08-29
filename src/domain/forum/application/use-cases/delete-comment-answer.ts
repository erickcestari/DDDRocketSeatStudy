import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"

interface DeleteUseCaseRequest {
  authorId: string
  questionCommentId: string
}

interface DeleteUseCaseResponse {

}

export class DeleteQuestionUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId
  }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
    const question = await this.answerCommentRepository.findById(questionCommentId)

    if (!question) {
      throw new Error('Question not found')
    }

    if(authorId != question.authorId.toString()) {
      throw new Error('You are not the author of this question')
    }

    await this.answerCommentRepository.delete(question)
    
    return {}
  }
}

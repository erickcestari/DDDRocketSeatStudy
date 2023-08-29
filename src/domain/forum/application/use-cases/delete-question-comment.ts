import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

interface DeleteQuestionCommentUseCaseResponse {

}

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository
    ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new Error('QuestionComment not found')
    }
  
    if(questionComment.authorId.toString() != authorId) {
      throw new Error('You are not the author of this question comment')
    }

    await this.questionCommentsRepository.delete(questionComment)

    return {
      questionComment,
    }
  }
}

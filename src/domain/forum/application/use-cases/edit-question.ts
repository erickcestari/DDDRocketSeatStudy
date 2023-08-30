import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditUseCaseRequest {
  authorId: string
  title: string
  content: string
  questionId: string
}

type EditUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    questionId
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if(authorId != question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
    
    return right({})
  }
}

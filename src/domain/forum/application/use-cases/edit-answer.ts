import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface EditUseCaseRequest {
  authorId: string
  content: string
  answerId: string
}

type EditUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    content,
    answerId
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if(authorId != answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    answer.content = content

    await this.answersRepository.save(answer)
    
    return right({})
  }
}

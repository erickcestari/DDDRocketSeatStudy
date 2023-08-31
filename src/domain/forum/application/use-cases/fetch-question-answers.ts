import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<ResourceNotFoundError, {answers: Answer[]}>

export class FetchQuestionAnswersUseCase {
  constructor(private asnwersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answers = await this.asnwersRepository.findManyByQuestionId(questionId, {page})

    if(!answers) {
      return left(new ResourceNotFoundError())
    }

    return right({answers})
  }
}

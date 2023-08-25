import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}
interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository, 
    private answersRepository: AnswersRepository) {}
  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if(!answer) {
      throw new Error('Answer not found')
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if(!question) {
      throw new Error('Question not found')
    }

    console.log(authorId, question.authorId.toString())

    if (authorId != question.authorId.toString()) {
      throw new Error('You are not the author of this question')
    }

    question.bestAnswerId = new UniqueEntityId(answerId)

    await this.questionsRepository.save(question)

    return {
      question
    }

  }
}

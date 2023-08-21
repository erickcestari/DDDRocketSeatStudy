import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  
  it('should create a question', async () => {

    const { answer } = await sut.execute({
      instructorId: 'instructor-id',
      questionId: 'question-id',
      content: 'This is the question content',
    })

    expect(answer.content).toEqual('This is the question content')
    expect(inMemoryAnswersRepository.items[0].id).toEqual(answer.id)

  })
})

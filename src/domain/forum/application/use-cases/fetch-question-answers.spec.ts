import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository


describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    for(let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
      }))
    }
    
    const result = await sut.execute({
      page: 1,
      questionId: 'question-1'
    })

    
    result.isRight() && expect(result.value.answers).toHaveLength(20)
  })
})

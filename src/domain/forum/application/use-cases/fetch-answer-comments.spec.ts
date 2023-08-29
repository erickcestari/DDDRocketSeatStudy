import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
InMemoryAnswerCommentsRepository

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase


describe('Fetch Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comment', async () => {
    for(let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityId('answer-1')
      }))
    }
    
    inMemoryAnswerCommentsRepository.items.length
    const { answerComments } = await sut.execute({
      page: 1,
      answerId: 'answer-1'
    })

    expect(answerComments).toHaveLength(20)
  })
})

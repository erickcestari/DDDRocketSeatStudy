import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
InMemoryQuestionCommentsRepository

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase


describe('Fetch Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comment', async () => {
    for(let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
      }))
    }
    
    inMemoryQuestionCommentsRepository.items.length
    const result = await sut.execute({
      page: 1,
      questionId: 'question-1'
    })

    expect(result.value?.questionComments).toHaveLength(20)
  })
})

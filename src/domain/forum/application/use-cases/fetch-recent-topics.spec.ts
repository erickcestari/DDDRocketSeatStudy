import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { FetchRecentQuestionsUseCase } from './fetch-recent-topics'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase


describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recents questions', async () => {
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2021-01-01')}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2022-01-01')}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2022-01-10')}))

    const { questions } = await sut.execute({
      page: 1,
    })
    
    expect(questions).toEqual([
      expect.objectContaining({createdAt: new Date('2022-01-10')}),
      expect.objectContaining({createdAt: new Date('2022-01-01')}),
      expect.objectContaining({createdAt: new Date('2021-01-01')}),
    ])
  })
})

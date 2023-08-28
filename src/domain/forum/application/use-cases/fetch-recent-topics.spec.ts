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
    for(let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2021-01-01')}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2022-01-01')}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date('2022-01-10')}))
    
    inMemoryQuestionsRepository.items.length
    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toHaveLength(20)
  })
})

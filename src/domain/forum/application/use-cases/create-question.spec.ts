import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should create a question', async () => {

    const { question } = await sut.execute({
      authorId: 'author-id',
      title: 'This is the question title',
      content: 'This is the question content',
    })

    expect(question.content).toEqual('This is the question content')
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id)
  })
})

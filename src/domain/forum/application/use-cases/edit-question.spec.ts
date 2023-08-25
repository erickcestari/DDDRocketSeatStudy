import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'New Title',
      content: 'New Content',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject(
      {
        content: 'New Content',
        title: 'New Title',
      }
    )
  })

  it('should not be able to edit a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {return sut.execute({
      questionId: 'question-1',
      authorId: 'author-123',
      title: 'New Title',
      content: 'New Content',
    })}).rejects.toBeInstanceOf(Error)

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)
  })

  
})

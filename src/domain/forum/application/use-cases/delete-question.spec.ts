import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    console.log(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    console.log(newQuestion)

    expect(() => {return sut.execute({
      questionId: 'question-1',
      authorId: 'author-123',
    })}).rejects.toBeInstanceOf(Error)

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)
  })

  
})

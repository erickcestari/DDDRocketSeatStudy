import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {

    const newAnswer = makeAnswer({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'New Content',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject(
      {
        content: 'New Content',
      }
    )
  })

  it('should not be able to edit a answer', async () => {

    const newAnswer = makeAnswer({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    expect(() => {return sut.execute({
      answerId: 'answer-1',
      authorId: 'author-123',
      content: 'New Content',
    })}).rejects.toBeInstanceOf(Error)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)
  })

  
})
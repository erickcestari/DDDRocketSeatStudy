
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {

    const newAnswer = makeAnswer({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer', async () => {

    const newAnswer = makeAnswer({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)


    inMemoryAnswerAttachmentsRepository.items.push(makeAnswerAttachment({
      answerId: new UniqueEntityId('answer-1'),
      attachmentId: new UniqueEntityId('attachment-1'),
    }),
    makeAnswerAttachment({
      answerId: new UniqueEntityId('answer-1'),
      attachmentId: new UniqueEntityId('attachment-2'),
    }))
    
    const result = await sut.execute({
    answerId: 'answer-1',
    authorId: 'author-123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)
  })
  
})

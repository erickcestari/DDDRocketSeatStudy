import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })

  it('should be able to edit a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(makeQuestionAttachment({
      questionId: new UniqueEntityId('question-1'),
      attachmentId: new UniqueEntityId('attachment-1'),
    }),
    makeQuestionAttachment({
      questionId: new UniqueEntityId('question-1'),
      attachmentId: new UniqueEntityId('attachment-2'),
    }))

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject(
      {
        content: 'New Content',
        title: 'New Title',
      }
    )

    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-3') }),
    ])
  })

  it('should not be able to edit a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityId('author-1')}, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
    questionId: 'question-1',
    authorId: 'author-123',
    title: 'New Title',
    content: 'New Content',
    attachmentsIds: [],
  })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.items).toHaveLength(1)
  })

  
})

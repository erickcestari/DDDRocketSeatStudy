import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-comment-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delte a answer comment', async () => {

    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not to be able to delte a answer comment', async () => {

    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-123')
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)
    expect(() => {
      return sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-1',
      })
    }).rejects.toBeInstanceOf(Error)

  })
})

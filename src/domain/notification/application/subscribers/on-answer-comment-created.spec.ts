import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "@/domain/notification/application/use-cases/send-notification"
import { makeAnswer } from "test/factories/make-answer"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { waitFor } from "test/utils/wait-for"
import { SpyInstance } from "vitest"
import { OnAnswerCommentCreated } from "./on-answer-comment-created-"

let inMemoryAnswerAttachamentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest], 
  Promise<SendNotificationUseCaseResponse>
>

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryAnswerAttachamentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sendNotificationUsecase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachamentsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUsecase, 'execute')
    
    new OnAnswerCommentCreated(inMemoryAnswersRepository, sendNotificationUsecase)
  })
  it('should send a notification when an answer is created', async () => {
    const answer = makeAnswer()
    
    inMemoryAnswersRepository.create(answer)

    const answerComment = makeAnswerComment({answerId: answer.id})

    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    }) 
  })
})
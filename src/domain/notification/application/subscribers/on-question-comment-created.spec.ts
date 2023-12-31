import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "@/domain/notification/application/use-cases/send-notification"
import { makeQuestion } from "test/factories/make-question"
import { makeQuestionComment } from "test/factories/make-question-comment"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { waitFor } from "test/utils/wait-for"
import { SpyInstance } from "vitest"
import { OnQuestionCommentCreated } from "./on-question-comment-created"

let inMemoryQuestionAttachamentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest], 
  Promise<SendNotificationUseCaseResponse>
>

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryQuestionAttachamentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sendNotificationUsecase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachamentsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUsecase, 'execute')
    
    new OnQuestionCommentCreated(inMemoryQuestionsRepository, sendNotificationUsecase)
  })
  it('shoulde send a notification when an answer is created', async () => {
    const question = makeQuestion()
    
    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({questionId: question.id})

    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    }) 
  })
})
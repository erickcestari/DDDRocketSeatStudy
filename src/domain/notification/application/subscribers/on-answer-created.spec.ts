import { makeAnswer } from "test/factories/make-answer"
import { OnAnswerCreated } from "./on-answer-created"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer=attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "@/domain/notification/application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeQuestion } from "test/factories/make-question"
import { SpyInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"


let inMemoryQuestionAttachamentsRepository: InMemoryQuestionAttachmentsRepository
let inmemoryAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUsecase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest], 
  Promise<SendNotificationUseCaseResponse>
>

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryQuestionAttachamentsRepository = new InMemoryQuestionAttachmentsRepository()
    inmemoryAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sendNotificationUsecase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachamentsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inmemoryAttachmentsRepository)
    
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUsecase, 'execute')
    
    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUsecase)
  })
  it('shoulde send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({questionId: question.id})
    
    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    }) 
  })
})
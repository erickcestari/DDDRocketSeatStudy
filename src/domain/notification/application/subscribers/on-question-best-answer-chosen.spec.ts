import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "@/domain/notification/application/use-cases/send-notification"
import { makeAnswer } from "test/factories/make-answer"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer=attachments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { waitFor } from "test/utils/wait-for"
import { SpyInstance } from "vitest"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen"


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
    
    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUsecase)
  })
  it('shoulde send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({questionId: question.id})
    
    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    }) 
  })
})
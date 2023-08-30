import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { SendNotificationUseCase } from "./send-notification"

let sut: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should create a question', async () => {

    const result = await sut.execute({
      title: 'This is the question title',
      content: 'This is the question content',
      recipientId: 'recipient-id',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toBe(result.value?.notification)
  })
})

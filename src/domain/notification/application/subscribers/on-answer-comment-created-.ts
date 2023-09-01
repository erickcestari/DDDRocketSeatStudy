import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-commet-created-event";

import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentCreatedNotification.bind(this),
      AnswerCommentCreatedEvent.name
    )
  }

  private async sendAnswerCommentCreatedNotification({ answerComment }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(answerComment.answerId.toString())

    console.log('enviando notification')

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi comentado em "${answer.content.substring(0, 40).concat('...')}"`,
        content: answerComment.content
      })
    }
  }
}
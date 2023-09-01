import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-crated-event";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

export class OnQuestionQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionQuestionCommentCreatedNotification.bind(this),
      QuestionCommentCreatedEvent.name
    )
  }

  private async sendQuestionQuestionCommentCreatedNotification({ questionComment }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(questionComment.questionId.toString())

    console.log('enviando notification')

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Sua questão foi comentado em "${question.title.substring(0, 40).concat('...')}"`,
        content: questionComment.content
      })
    }
  }
}
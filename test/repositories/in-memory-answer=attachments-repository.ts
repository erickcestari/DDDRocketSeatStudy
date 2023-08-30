import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {  
  public items: AnswerAttachment[] = []


  async findManyByAnswerId(answerId: string ): Promise<AnswerAttachment[]> {
    const answerAttachments = this.items.
    filter(answer => answer.answerId.toString() == answerId)

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      answerAttachment => answerAttachment.answerId.toString() != answerId
    )

    this.items = answerAttachments
  }
}
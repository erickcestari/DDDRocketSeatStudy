import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface EditUseCaseRequest {
  authorId: string
  content: string
  answerId: string
  attachmentsIds: string[]
}

type EditUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository, private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async execute({
    authorId,
    content,
    answerId,
    attachmentsIds
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if(authorId != answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

    const answerAttachments = attachmentsIds.map(attachmentId => AnswerAttachment.create({
      attachmentId: new UniqueEntityId(attachmentId),
      answerId: answer.id,
    }))

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answersRepository.save(answer)
    
    return right({})
  }
}

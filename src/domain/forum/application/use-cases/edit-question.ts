import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface EditUseCaseRequest {
  authorId: string
  title: string
  content: string
  questionId: string
  attachmentsIds: string[]
}

type EditUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository, private questionAtachmentsRepository: QuestionAttachmentsRepository) {}

  async execute({
    authorId,
    content,
    title,
    questionId,
    attachmentsIds
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if(authorId != question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments = await this.questionAtachmentsRepository.findManyByQuestionId(questionId)
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

    const questionAttachments = attachmentsIds.map(attachmentId => QuestionAttachment.create({
      attachmentId: new UniqueEntityId(attachmentId),
      questionId: question.id,
    }))

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)
    
    return right({})
  }
}

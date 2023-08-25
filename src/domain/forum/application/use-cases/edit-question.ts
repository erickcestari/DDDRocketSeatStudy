import { QuestionsRepository } from '../repositories/questions-repository'

interface EditUseCaseRequest {
  authorId: string
  title: string
  content: string
  questionId: string
}

interface EditUseCaseResponse {

}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    questionId
  }: EditUseCaseRequest): Promise<EditUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if(authorId != question.authorId.toString()) {
      throw new Error('You are not the author of this question')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
    
    return {}
  }
}

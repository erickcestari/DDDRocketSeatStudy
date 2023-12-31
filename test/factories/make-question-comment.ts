import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment"
import { faker } from '@faker-js/faker'

export const makeQuestionComment = (
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) => {

  const questionComment = QuestionComment.create({
    authorId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  },
    id,
  )

  return questionComment
}
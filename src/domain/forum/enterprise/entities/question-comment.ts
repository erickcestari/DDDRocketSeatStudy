import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps{
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {

  get questionId(): string {
    return this.props.questionId
  }
 
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id
    
    if(isNewQuestionComment){
      questionComment.addDomainEvent(new QuestionCommentCreatedEvent(questionComment))
    }

    return questionComment
  }
}

import { UniqueEntityId } from "../core/entities/unique-entity-id";
import { Answer } from "../domain/entities/answer";
import { AnswersRepository } from "../domain/repositories/answer-respository";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
  ) { }
  async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content: content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    await this.answersRepository.create(answer);

    return answer;
  }
}
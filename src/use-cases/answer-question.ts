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
  ) {} 
  async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer({
      content:content, 
      authorId: instructorId, 
      questionId: questionId
    });

    await this.answersRepository.create(answer);

    return answer;
  }
}
import { AnswerQuestionUseCase } from './answer-question';
import { AnswersRepository } from '../domain/repositories/answer-respository';
import { Answer } from '../domain/entities/answer';

const fakeAnswersRepository: AnswersRepository = {
  create: async (asnwer: Answer) => {
    return
  }
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

  const answer = await answerQuestion.execute({
    content: 'This is the answer content',
    instructorId: 'instructor-id',
    questionId: 'question-id',
  })

  expect(answer.content).toEqual('This is the answer content');
})
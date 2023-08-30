import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { CreateQuestionUseCase } from './create-question'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase
let createQuestionUseCase: CreateQuestionUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    createQuestionUseCase = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question', async () => {
    /*
    const {question: newQuestion}  = await createQuestionUseCase.execute({
      authorId: new UniqueEntityId().toString(),
      content: 'This is the question content',
      title: ' Question Slug ',
    })
    */
    /*
    const newQuestion = Question.create({
      authorId: new UniqueEntityId(),
      content: 'This is the question content',
      title: ' Question Slug ',
    })

    inMemoryQuestionsRepository.create(newQuestion)
    */

    const newQuestion = makeQuestion({
      slug: Slug.create('question-slug'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)
    
    const result = await sut.execute({
      slug: newQuestion.slug,
    })

    result.isRight() && expect(result.value.question.slug).toEqual('question-slug')
    expect(result.isRight()).toBeTruthy()
  })
})

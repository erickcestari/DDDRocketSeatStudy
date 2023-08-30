import { Either, Right, left, right } from "./either"

function doSometing(x: boolean): Either<string, number> {
  if(x) {
    return right(10)
  }
  return left("error")
}

test('success result', () => {
  const sucessResult = doSometing(true)

  expect(sucessResult.isRight()).toBe(true)
  expect(sucessResult.isLeft()).toBe(false)
})

test('error result', () => {
  const errorResult = doSometing(false)

  expect(errorResult.isLeft()).toBe(true)
  expect(errorResult.isRight()).toBe(false)
})
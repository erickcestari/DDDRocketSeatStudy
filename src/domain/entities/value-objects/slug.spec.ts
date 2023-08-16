import { Slug } from "./slug";

test("create a slug", () => {
  const slug = Slug.createFromText("This Is a Slug");

  expect(slug.value).toEqual("this-is-a-slug");
})
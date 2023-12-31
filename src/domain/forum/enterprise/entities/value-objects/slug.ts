export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Slug {
    return new Slug(value)
  }

  /**
   * Receives a string and normalizes it to a slug.
   *
   * Example: "This is a slug" -> "this-is-a-slug"
   *
   * @param text {string}
   * @returns
   */
  static createFromText(text: string): Slug {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slug)
  }
}

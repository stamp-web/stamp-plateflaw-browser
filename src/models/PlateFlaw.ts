export class PlateFlaw {
  name: string
  path: string
  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }

  static fromString(value: string): PlateFlaw {
    const name = value.substring(value.lastIndexOf('/') + 1)
    return new PlateFlaw(name, value)
  }
}

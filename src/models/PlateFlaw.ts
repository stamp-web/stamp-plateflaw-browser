export class PlateFlaw {
  name: string
  path: string
  isUnknown: boolean

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
    this.isUnknown = this.checkIfUnknown()
  }

  private checkIfUnknown(): boolean {
    const regex = /^.*(?:pf\d+|pw\d+)(?:.*)\.(png|jpeg|jpg)$/i
    return regex.test(this.name)
  }

  static fromString(value: string): PlateFlaw {
    const name = value.substring(value.lastIndexOf('/') + 1)
    return new PlateFlaw(name, value)
  }
}

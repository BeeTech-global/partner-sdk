export default class InvalidParamExpection extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamExpection';
  }
}

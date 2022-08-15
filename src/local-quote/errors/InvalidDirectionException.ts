export default class InvalidDirectionException extends Error {
  constructor() {
    super('Invalid direction');
    this.name = 'InvalidDirectionException';
  }
}

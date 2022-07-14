export default class InvalidDirectionExpection extends Error {
  constructor() {
    super('Invalid direction');
    this.name = 'InvalidDirectionExpection';
  }
}

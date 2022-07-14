export default class UnsupportedPurposeExpection extends Error {
  constructor() {
    super('Unsupported purpose');
    this.name = 'UnsupportedPurposeExpection';
  }
}

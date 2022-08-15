export default class UnsupportedPurposeException extends Error {
  constructor() {
    super('Unsupported purpose');
    this.name = 'UnsupportedPurposeException';
  }
}

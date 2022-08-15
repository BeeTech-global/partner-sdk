export default class DirectionNotAvailableException extends Error {
  constructor() {
    super('Direction not available for this purpose');
    this.name = 'DirectionNotAvailableException';
  }
}

export default class DirectionNotAvailableExpection extends Error {
  constructor() {
    super('Direction not available for this purpose');
    this.name = 'DirectionNotAvailableExpection';
  }
}

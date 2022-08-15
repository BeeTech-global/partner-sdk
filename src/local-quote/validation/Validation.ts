import { InvalidParamException } from "../errors";
import { Currencies, Direction, Purposes } from "../Quote";

export interface IValidation {
  validate(input: any): Error | null
}


export default class Validation implements IValidation {
  validate(input: any): Error | null {
    const {
      baseCurrencyISO,
      quotedCurrencyISO,
      purpose,
      direction
    } = input;

    const currencies = Object.keys(Currencies);
    const purposes = Object.keys(Purposes);
    const directions = Object.keys(Direction);

    if (!directions.includes(direction)) {
      return new InvalidParamException('Only direction are supported INBOUND/OUTBOUND');
    }

    if (!purposes.includes(purpose)) {
      return new InvalidParamException('Only purposes are supported CRYPTO/PAYMENT_PROCESSING');
    }

    if (
      !currencies.includes(baseCurrencyISO)
      ||
      !currencies.includes(quotedCurrencyISO)
    ) {
      return new InvalidParamException('Only currencies are supported BRL/USD/EUR');
    }

    return null;
  }
}

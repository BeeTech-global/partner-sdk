import { InvalidParamException } from "../errors";
import { Currencies, Direction, InternalCurrencies, Purposes } from "../Quote";

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

    const currencies = Object.keys(Currencies).concat(Object.keys(InternalCurrencies) )  ;
    const purposes = Object.keys(Purposes);
    const directions = Object.keys(Direction);

    if (!directions.includes(direction)) {
      return new InvalidParamException('Only direction are supported INBOUND/OUTBOUND');
    }

    if (!purposes.includes(purpose)) {
      return new InvalidParamException('Invalid purpose');
    }

    if (
      !currencies.includes(baseCurrencyISO)
      ||
      !currencies.includes(quotedCurrencyISO)
    ) {
      return new InvalidParamException('Only currencies are supported BRL/USD/EUR/AUD/CHF');
    }

    return null;
  }
}

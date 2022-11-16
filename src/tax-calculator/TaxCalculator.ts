import { Direction, Purposes } from "../local-quote/Quote";
import settings from "./settings";

interface CalculateParams {
  currencyAmount: number,
  direction: Direction,
  purpose: Purposes | null,
}

export default class TaxCalculator {
  public static getTaxAmount({currencyAmount, direction, purpose}: CalculateParams): number {
    const IOFRate = this.getTaxRate(purpose, direction)
    return currencyAmount * (IOFRate/100)
  }

  public static getTaxRate(purpose: Purposes | null, direction: Direction): number {
    let purposeTax;

    if(purpose) {
      purposeTax = settings.taxes[purpose];
    }

    if(!purposeTax) {
      purposeTax = settings.taxes.DEFAULT;
    }

    return purposeTax[direction].IOF.value;
  }
}

import { Direction, Purposes } from "../local-quote/Quote";
import settings from "./settings";

interface CalculateParams {
  currencyAmount: number,
  direction: Direction,
  purpose: Purposes | null,
  isCryptoNubank?: boolean
}

export default class TaxCalculator {
  public static getTaxAmount({currencyAmount, direction, purpose, isCryptoNubank}: CalculateParams): number {
    const IOFRate = this.getTaxRate(purpose, direction, isCryptoNubank)
    return currencyAmount * (IOFRate/100)
  }

  public static getTaxRate(purpose: Purposes | null, direction: Direction, isCryptoNubank: boolean = false): number {
    let purposeTax;

    if(isCryptoNubank) {
      purposeTax = settings.taxes.CRYPTO_NUBANK;
    } else if(purpose) {
      purposeTax = settings.taxes[purpose];
    }

    if(!purposeTax) {
      purposeTax = settings.taxes.DEFAULT;
    }

    return purposeTax[direction].IOF.value;
  }
}

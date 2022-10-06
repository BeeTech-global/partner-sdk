import { Direction, Purposes } from "../local-quote/Quote";
import settings from "./settings";

interface CalculateParams {
  currencyAmount: number,
  direction: Direction,
}

export default class TaxCalculator {
  public static getTaxAmount({currencyAmount, direction}: CalculateParams): number {
    const IOFRate = this.getTaxRate(direction)
    return currencyAmount * (IOFRate/100)
  }

  public static getTaxRate(direction: Direction): number {
    return settings.taxes.IOF[direction].rate
  }
}

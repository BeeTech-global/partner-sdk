import InboundCalculator from "./adapters/InboundCalculator";
import OutboundCalculator from "./adapters/OutboundCalculator";

import { IQuoteCalculus, ICalculus, Direction, Purposes, Quote, LocalQuote, Currencies } from "./Quote";

import {
  DirectionNotAvailableExpection,
  InvalidDirectionExpection,
  UnsupportedPurposeExpection
} from "./errors";

import settings from "./settings";

export default class QuoteCalculator implements IQuoteCalculus {
  private calculus!: ICalculus;

   buildAdapter(direction: Direction): void {
    switch (direction) {
      case Direction.INBOUND:
        this.calculus = new InboundCalculator();
        break;

      case Direction.OUTBOUND:
        this.calculus = new OutboundCalculator();
        break;

      default:
        throw new InvalidDirectionExpection();
    }
  }

  calculate(quote: Quote, amount: number): LocalQuote {
   const { direction, purpose } = quote;
   this.buildAdapter(direction);

   const tax = this.seekTaxesByPurpose(purpose, direction);

   return this.calculus.calculate(quote, amount, tax);
  }

  private seekTaxesByPurpose(purpose: Purposes, direction: Direction): number {
    const purposeTaxes = settings.taxes[purpose];

    if (!purposeTaxes) {
      throw new UnsupportedPurposeExpection();
    }

    const purposeTaxesDirection = purposeTaxes[direction];

    if (!purposeTaxesDirection) {
      throw new DirectionNotAvailableExpection();
    }

    return purposeTaxesDirection.IOF.value;
  }
}

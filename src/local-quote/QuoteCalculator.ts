import InboundCalculator from "./adapters/InboundCalculator";
import OutboundCalculator from "./adapters/OutboundCalculator";

import { IQuoteCalculus, ICalculus, Direction, Purposes, Quote, LocalQuote } from "./Quote";

import {
  DirectionNotAvailableExpection,
  InvalidDirectionExpection,
  UnsupportedPurposeExpection,
} from "./errors";

import settings from "./settings";
import { IValidation } from "./validation/Validation";

export default class QuoteCalculator implements IQuoteCalculus {
  private calculus!: ICalculus;

  constructor(
    private readonly validation: IValidation
  ) {}

   buildAdapter(direction: string): void {
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

   const error = this.validation.validate(quote);
   console.log(error)
   if (error) {
    throw error;
   }

   const tax = this.seekTaxesByPurpose(purpose, direction);

   return this.calculus.calculate(quote, amount, tax);
  }

  private seekTaxesByPurpose(purpose: string, direction: string): number {
    const purposeTaxes = settings.taxes[purpose as Purposes]

    if (!purposeTaxes) {
      throw new UnsupportedPurposeExpection();
    }

    const purposeTaxesDirection = purposeTaxes[direction as Direction];

    if (!purposeTaxesDirection) {
      throw new DirectionNotAvailableExpection();
    }

    return purposeTaxesDirection.IOF.value;
  }
}

import InboundCalculator from "./adapters/InboundCalculator";
import OutboundCalculator from "./adapters/OutboundCalculator";

import { IQuoteCalculus, ICalculus, Direction, Purposes, Quote, LocalQuote } from "./Quote";

import {
  InvalidDirectionException,
} from "./errors";

import { IValidation } from "./validation/Validation";
import TaxCalculator from "../tax-calculator/TaxCalculator";

export default class QuoteCalculator implements IQuoteCalculus {
  private calculus!: ICalculus;

  constructor(
    private readonly validation: IValidation,
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
        throw new InvalidDirectionException();
    }
  }

  calculate(quote: Quote, amount: number): LocalQuote {
   const { direction, purpose } = quote;
   this.buildAdapter(direction);

   const error = this.validation.validate(quote);
   if (error) {
    throw error;
   }

   const taxRate = TaxCalculator.getTaxRate(purpose as Purposes, direction as Direction)

   return this.calculus.calculate(quote, amount, taxRate);
  }
}

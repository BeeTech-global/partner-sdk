import { TaxCalculator } from "../tax-calculator/TaxCalculator";
import QuoteCalculator from "./QuoteCalculator";
import { Validation } from "./validation";

const factoryQuoteCalulator = () => {
  const validation = new Validation();
  const taxCalculator = new TaxCalculator();
  return new QuoteCalculator(validation, taxCalculator);
}

export default factoryQuoteCalulator()

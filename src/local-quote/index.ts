import QuoteCalculator from "./QuoteCalculator";
import { Validation } from "./validation";

const factoryQuoteCalulator = () => {
  const validation = new Validation();
  return new QuoteCalculator(validation);
}

export default factoryQuoteCalulator()

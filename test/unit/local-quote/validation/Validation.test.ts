import { InvalidParamExpection } from "../../../../src/local-quote/errors";
import Validation from "../../../../src/local-quote/validation/Validation";


describe('Validation', () => {

  it('return an exception if the direction is not correct', () => {
    const quote = {
      id: 'quote_id',
      direction: 'WHATEVER',
      purpose: 'CRYPTO',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.360662
    }

    const validation = new Validation();
    expect(
      validation.validate(quote)
    ).toEqual(new InvalidParamExpection('Only direction are supported INBOUND/OUTBOUND'));
  });

  it('return an exception if the purpose is not supported', () => {
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'WHATEVER',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.360662
    }

    const validation = new Validation();
    expect(
      validation.validate(quote)
    ).toEqual(new InvalidParamExpection('Only purposes are supported CRYPTO/PAYMENT_PROCESSING'));
  });

  it('return an exception if the baseCurrencyISO is not supported', () => {
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'GBP',
      quotedCurrencyISO: 'BRL',
      exchangeRate: 5.360662
    }

    const validation = new Validation();
    expect(
      validation.validate(quote)
    ).toEqual(new InvalidParamExpection('Only currencies are supported BRL/USD/EUR'));
  });

  it('return an exception if the quotedCurrencyISO is not supported', () => {
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'AUD',
      exchangeRate: 5.360662
    }

    const validation = new Validation();
    expect(
      validation.validate(quote)
    ).toEqual(new InvalidParamExpection('Only currencies are supported BRL/USD/EUR'));
  });

  it('return null if all validation passes', () => {
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'EUR',
      exchangeRate: 5.360662
    }

    const validation = new Validation();
    expect(
      validation.validate(quote)
    ).toEqual(null);
  });
});
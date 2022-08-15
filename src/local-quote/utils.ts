import BigNumber from 'bignumber.js';

enum NumberPrecisionConfig {
  DECIMAL_PLACES = 'DECIMAL_PLACES',
  ROUNDING_MODE = 'ROUNDING_MODE',
  ERRORS = 'ERRORS',
}

export default class PrecisionNumber {
  readonly precisionDefault = 6;

  readonly precisionMoney = 2;

  readonly precisionExchangeRate = 10;

  truncateMoney(value: number): number {
    return this.numberPrecision(value, this.precisionMoney).toNumber();
  }

  truncate(value: number): number {
    return this.numberPrecision(value, this.precisionDefault).toNumber();
  }

  truncateExchangeRate(value: number): number {
    return this.numberPrecision(value, this.precisionExchangeRate).toNumber();
  }

  moneyPrecision(value: number): BigNumber {
    return this.numberPrecision(value, this.precisionMoney);
  }

  exchangeRatePrecision(value: number): BigNumber {
    return this.numberPrecision(value, this.precisionExchangeRate);
  }

  numberPrecision(n: number, decimalPlaces = 6): BigNumber {
    const config = {
      [NumberPrecisionConfig.DECIMAL_PLACES]: decimalPlaces,
      [NumberPrecisionConfig.ROUNDING_MODE]: BigNumber.ROUND_HALF_EVEN,
      [NumberPrecisionConfig.ERRORS]: false,
    };

    BigNumber.config(config);

    return new BigNumber(n, 10);
  }
}

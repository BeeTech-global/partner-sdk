import BigNumber from 'bignumber.js';

enum NumberPrecisionConfig {
  DECIMAL_PLACES = 'DECIMAL_PLACES',
  ROUNDING_MODE = 'ROUNDING_MODE',
  ERRORS = 'ERRORS',
}

export const roundHalfEven = (amount: number, precision = 2): number => {

  const config = {
    [NumberPrecisionConfig.DECIMAL_PLACES]: precision,
    [NumberPrecisionConfig.ROUNDING_MODE]: BigNumber.ROUND_HALF_EVEN,
    [NumberPrecisionConfig.ERRORS]: false,
  };

  BigNumber.config(config);

  return new BigNumber(amount, 10).toNumber();
}

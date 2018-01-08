import toUnixTimestamp from '../../../src/utils/toUnixTimestamp';

describe('toUnixTimestamp(date)', () => {
  it('accepts one arguments', () => {
    const actual = toUnixTimestamp.length;
    const expected = 1;

    expect(actual).toBe(expected);
  });

  it('returns an integer', () => {
    const inputDate = new Date('25 October 1989, 01:20 GMT+02:00');
    const returnValue = toUnixTimestamp(inputDate);

    expect(typeof returnValue).toBe('number');
    expect(Number.isInteger(returnValue)).toBe(true);
  });

  it('does not modify the input argument', () => {
    const inputDate = new Date('25 October 1989, 01:20:19 GMT+02:00');
    const expected = inputDate.toString();

    toUnixTimestamp(inputDate);

    const actual = inputDate.toString();

    expect(actual).toBe(expected);
  });

  it('returns the date as a unix timestamp', () => {
    const inputDate = new Date('25 October 1989, 01:20:19 GMT+02:00');
    const expected = 625274419;
    const actual = toUnixTimestamp(inputDate);

    expect(actual).toBe(expected);
  });
});

import getFullHour from '../../../src/utils/getFullHour';

describe('getFullHour(date)', () => {
  it('accepts one arguments', () => {
    const actual = getFullHour.length;
    const expected = 1;

    expect(actual).toBe(expected);
  });

  it('returns a date', () => {
    const inputDate = new Date('25 October 1989, 01:20 GMT+02:00');
    const returnDate = getFullHour(inputDate);

    expect(returnDate instanceof Date).toBe(true);
  });

  it('does not modify the input argument', () => {
    const inputDate = new Date('25 October 1989, 01:20:19 GMT+02:00');
    const expected = inputDate.toString();

    getFullHour(inputDate);

    const actual = inputDate.toString();

    expect(actual).toBe(expected);
  });

  it('returns the full hour', () => {
    const inputDate = new Date('25 October 1989, 01:20:19 GMT+02:00');
    const expected = new Date('25 October 1989, 01:00:00 GMT+02:00');
    const actual = getFullHour(inputDate);

    expect(actual.toString()).toBe(expected.toString());
  });

  describe('when the input date is already a full hour', () => {
    it('returns the same date', () => {
      const inputDate = new Date('25 October 1989, 01:00:00 GMT+02:00');
      const expected = new Date('25 October 1989, 01:00:00 GMT+02:00');
      const actual = getFullHour(inputDate);

      expect(actual.toString()).toBe(expected.toString());
    });
  });
});

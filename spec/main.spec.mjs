
import {
  number2coords,
  coords2number
} from '../src/main.mjs';

describe('number2coords', () => {
  it('Number must be greater than 0', () => {
    const err = Error('Number must be greater than 0');
    expect(() => number2coords(0)).toThrow(err);
    expect(() => number2coords(-1)).toThrow(err);
    expect(() => number2coords(-1e20)).toThrow(err);
  });

  it('Number is greater than 9007199254740991', () => {
    const err = Error('Number is greater than 9007199254740991');
    expect(() => number2coords(1e40)).toThrow(err);
    expect(() => number2coords(Number.MAX_SAFE_INTEGER + 1)).toThrow(err);
    expect(() => number2coords(Number.MAX_SAFE_INTEGER)).not.toThrow();
  });

  it('Number should be integer', () => {
    const err = Error('Number should be integer');
    expect(() => number2coords(0.5)).toThrow(err);
    expect(() => number2coords(1e10 + 0.5)).toThrow(err);
    expect(() => number2coords(1e10)).not.toThrow(err);
  });

  it('0 significant bits', () => {
    expect(number2coords(1).sigBits).toEqual([]);
    expect(number2coords(1).latitude).toEqual(0);
    expect(number2coords(1).longitude).toEqual(0);
  });

  it('1 significant bit', () => {
    expect(number2coords(2).sigBits).toEqual([0]);
    expect(number2coords(2).latitude).toEqual(0);
    expect(number2coords(2).longitude).toEqual(-90);

    expect(number2coords(3).sigBits).toEqual([1]);
    expect(number2coords(3).latitude).toEqual(0);
    expect(number2coords(3).longitude).toEqual(90);
  });
});

describe('coords2number', () => {
  it('Maximum significant bits is 52', () => {
    const err = Error('Maximum significant bits is 52');
    expect(() => coords2number(0, 0, 53)).toThrow(err);
    expect(() => coords2number(0, 0, 52)).not.toThrow(err);
  });

  it('sigBits should be integer', () => {
    const err = Error('sigBits should be integer');
    expect(() => coords2number(0, 0, 0.5)).toThrow(err);
    expect(() => coords2number(0, 0, 1)).not.toThrow(err);
  });
});

describe('integration number2coords + coords2number', () => {
  it('100k tests', () => {
    for (let i = 0; i < 1e5; ++i) {
      const magn = Math.round(Math.random() * 52);
      const n = Math.round(Math.random() * Number.MAX_SAFE_INTEGER / (2 ** magn));
      if (n === 0) continue;
      const { latitude, longitude, sigBits } = number2coords(n);
      expect(coords2number(latitude, longitude, sigBits.length)).toEqual(n);
    }
  })
});

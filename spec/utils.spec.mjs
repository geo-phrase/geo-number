
import {
  normalize,
  splitBits,
  toBits,
  mergeBits,
} from '../src/utils.mjs';

describe('normalize', () => {
  it('1 bit 0', () => {
    const { num, prec } = normalize([0]);
    expect(num).toBe(0.25);
    expect(prec).toBe(0.25);
  });

  it('1 bit 1', () => {
    const { num, prec } = normalize([1]);
    expect(num).toBe(0.75);
    expect(prec).toBe(0.25);
  });

  it('2 bits', () => {
    const prec = 0.125;
    expect(normalize([1, 1]).prec).toBe(prec);

    expect(normalize([0, 0]).num).toBe(prec);
    expect(normalize([0, 1]).num).toBe(prec + prec * 2);
    expect(normalize([1, 0]).num).toBe(prec + prec * 4);
    expect(normalize([1, 1]).num).toBe(prec + prec * 6);
  });

  it('26 bits = (53-1) / 2 bits', () => {
    const prec = 7.450580596923828e-9;
    const arr = new Array(26).fill(0);
    expect(normalize(arr).prec).toBe(prec);

    expect(normalize(arr).num).toBe(prec);
    arr[0] = 1;
    expect(normalize(arr).num).toBe(prec + prec * (2 ** 26));
  });
});

describe('splitBits', () => {
  it('empty array', () => {
    expect(splitBits([])).toEqual([[], []]);
  });

  it('1 bit', () => {
    expect(splitBits([0])).toEqual([[0], []]);
    expect(splitBits([1])).toEqual([[1], []]);
  });

  it('2 bits', () => {
    expect(splitBits([0, 0])).toEqual([[0], [0]]);
    expect(splitBits([1, 1])).toEqual([[1], [1]]);
  });

  it('3 bits', () => {
    expect(splitBits([0, 0, 0])).toEqual([[0, 0], [0]]);
    expect(splitBits([1, 1, 1])).toEqual([[1, 1], [1]]);
  });

  it('few bits', () => {
    expect(splitBits([0, 1, 0, 1])).toEqual([[0, 0], [1, 1]]);
    expect(splitBits([0, 0, 1, 1])).toEqual([[0, 1], [0, 1]]);

    expect(splitBits([0, 0, 1, 1, 0, 0, 1, 1])).toEqual([[0, 1, 0, 1], [0, 1, 0, 1]]);
  });
});

describe('toBits', () => {
  it('0 bits', () => {
    expect(toBits(0, 0)).toEqual([]);
    expect(toBits(1, 0)).toEqual([]);
  });

  it('1 bit', () => {
    expect(toBits(0, 1)).toEqual([0]);
    expect(toBits(1, 1)).toEqual([1]);
  });

  it('2 bits', () => {
    expect(toBits(0, 2)).toEqual([0, 0]);
    expect(toBits(0.4, 2)).toEqual([0, 1]);
    expect(toBits(0.6, 2)).toEqual([1, 0]);
    expect(toBits(1, 2)).toEqual([1, 1]);
  });

  it('26 bits', () => {
    expect(toBits(0, 26)).toEqual(new Array(26).fill(0));
    expect(toBits(1, 26)).toEqual(new Array(26).fill(1));
  });
});

describe('mergeBits', () => {
  it('empty', () => {
    expect(mergeBits([], [])).toEqual([]);
  });

  it('1 bit', () => {
    expect(mergeBits([0], [])).toEqual([0]);
    expect(mergeBits([1], [])).toEqual([1]);
    expect(mergeBits([], [0])).toEqual([]);
    expect(mergeBits([], [1])).toEqual([]);
  });

  it('2 bits', () => {
    expect(mergeBits([0], [0])).toEqual([0, 0]);
    expect(mergeBits([0], [1])).toEqual([0, 1]);
    expect(mergeBits([1], [0])).toEqual([1, 0]);
    expect(mergeBits([1], [1])).toEqual([1, 1]);
  });
});

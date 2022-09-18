
const normalize = bits => {
  const max = 2 ** bits.length;
  const prec = 0.5 / max;
  const num = parseInt('0' + bits.join(''), 2) / max + prec;
  return { num, prec };
};

const splitBits = bits => {
  return bits.reduce((acc, bit, i) => {
    return acc[i % 2].push(bit), acc;
  }, [[], []]);
};

const toBits = (num, bits) => {
  if (bits === 0) return [];
  const max = 2 ** bits;
  const prec = 0.5 / max;
  const capped = Math.min(Math.round((num - prec) * max), max - 1);
  return [...capped.toString(2).padStart(bits, '0')].slice(-bits).map(n => +n);
};

const mergeBits = (a, b) => {
  const res = [];
  const arr = [a, b];
  let i = 0;
  while (1) {
    const bit = arr[(i++) % 2].shift();
    if (typeof bit === 'undefined') return res;
    res.push(bit);
  }
};

export {
  normalize,
  splitBits,
  toBits,
  mergeBits,
};

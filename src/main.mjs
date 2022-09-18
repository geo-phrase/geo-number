
import {
  normalize,
  splitBits,
  toBits,
  mergeBits,
} from './utils.mjs';

// longitude range: [-180, 180]
// latitude range:  [ -90,  90]

const MAX = Number.MAX_SAFE_INTEGER;
const LON_RANGE = 360;
const LAT_RANGE = 180;

const number2coords = number => {
  if (number <= 0) throw Error(`Number must be greater than 0`);
  if (number > MAX) throw Error(`Number is greater than ${MAX}`);
  if (number % 1 !== 0) throw Error('Number should be integer');

  const bits = [...number.toString(2)].map(b => +b);
  const sigBits = bits.slice(1);

  const [lonBits, latBits] = splitBits(sigBits);
  const [lon, lat] = [lonBits, latBits].map(normalize);

  const latitude = lat.num * LAT_RANGE - LAT_RANGE / 2;
  const longitude = lon.num * LON_RANGE - LON_RANGE / 2;

  return {
    sigBits,
    latitude,
    longitude,
    lon: {
      bits: lonBits,
      val: longitude,
      prec: lon.prec * LON_RANGE
    },
    lat: {
      bits: latBits,
      val: latitude,
      prec: lat.prec * LAT_RANGE
    }
  };
};

const coords2number = (latitude, longitude, sigBits = 52) => {
  // 53-bit mantissa
  // MAX = 53 ** 2 - 1;
  if (sigBits > 52) throw Error('Maximum significant bits is 52');
  if (sigBits % 1 !== 0) throw Error('sigBits should be integer');

  const lat = (latitude + LAT_RANGE / 2) / LAT_RANGE;
  const lon = (longitude + LON_RANGE / 2) / LON_RANGE;

  const latBitsCnt = Math.floor(sigBits / 2);
  const lonBitsCnt = Math.ceil(sigBits / 2);

  const latBits = toBits(lat, latBitsCnt);
  const lonBits = toBits(lon, lonBitsCnt);

  const bits = mergeBits(lonBits, latBits);

  return parseInt('1' + bits.join(''), 2);
};

export { number2coords };
export { coords2number };

export default {
  number2coords,
  coords2number
};

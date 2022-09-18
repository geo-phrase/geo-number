
import {
  number2coords,
  coords2number
} from '../src/main.mjs';

import * as all from '../src/main.mjs';

// longitude range: [-180, 180]
// latitude range:  [ -90,  90]

// console.log(number2coords(8503967874043));
// console.log(number2coords(70368744177664));
const n = coords2number(0, 0);
console.log(n);
console.log(number2coords(n));
console.log(number2coords(n).sigBits.length);
// console.log(all);

import {Hsluv} from '../browser/esm/hsluv.js';

const digits = '0123456789abcdef';

/**
 * Test how many digits of HPLuv decimal precision is enough to unambiguously
 * specify a hex-encoded RGB color. Spoiler alert: it's 4.
 *
 * Adapted from: https://gist.github.com/roryokane/f15bb23abcf9938c0707
 * @param numDigits
 */
function testPrecision(numDigits) {
    const conv = new Hsluv();
    for (let i = 0; i < digits.length; i++) {
        const r1 = digits[i];
        for (let j = 0; j < digits.length; j++) {
            const g1 = digits[j];
            for (let k = 0; k < digits.length; k++) {
                // Assuming that only the least significant hex digit can cause a
                // collision. Otherwise this program uses too much memory.
                const b1 = digits[k];
                console.log('Testing #' + r1 + '_' + g1 + '_' + b1 + '_');
                const accum = {};
                for (let i1 = 0; i1 < digits.length; i1++) {
                    const r2 = digits[i1];
                    for (let j1 = 0; j1 < digits.length; j1++) {
                        const g2 = digits[j1];
                        for (let k1 = 0; k1 < digits.length; k1++) {
                            const b2 = digits[k1];
                            const hex = '#' + r1 + r2 + g1 + g2 + b1 + b2;
                            conv.hex = hex;
                            conv.hexToHsluv();
                            const hsl = [conv.hsluv_h, conv.hsluv_s, conv.hsluv_l];
                            const key = [hsl.map(function (ch) {
                                return ch.toFixed(numDigits);
                            })].join('|');
                            if (accum[key]) {
                                console.log("FOUND COLLISION:");
                                console.log(hex, accum[key]);
                                console.log(key);
                                return;
                            } else {
                                accum[key] = hex;
                            }
                        }
                    }
                }
            }
        }
    }
}

testPrecision(4);

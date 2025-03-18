import * as fs from 'fs';
import {Hsluv} from '../dist/hsluv.js';

function assertStringEquals(expected, actual) {
    if (expected !== actual) {
        throw new Error("Not equals");
    }
}

function assertFloatClose(expected, actual) {
    if (Math.abs(expected - actual) > 1e-10) {
        console.log(expected);
        console.log(actual);
        throw new Error("Not equals");
    }
}

function assertClose(expected, actual) {
    assertStringEquals(expected.hex, actual.hex);
    assertFloatClose(expected.rgb_r, actual.rgb_r);
    assertFloatClose(expected.rgb_g, actual.rgb_g);
    assertFloatClose(expected.rgb_b, actual.rgb_b);
    assertFloatClose(expected.xyz_x, actual.xyz_x);
    assertFloatClose(expected.xyz_y, actual.xyz_y);
    assertFloatClose(expected.xyz_z, actual.xyz_z);
    assertFloatClose(expected.luv_l, actual.luv_l);
    assertFloatClose(expected.luv_u, actual.luv_u);
    assertFloatClose(expected.luv_v, actual.luv_v);
    assertFloatClose(expected.lch_l, actual.lch_l);
    assertFloatClose(expected.lch_c, actual.lch_c);
    assertFloatClose(expected.lch_h, actual.lch_h);
    assertFloatClose(expected.hsluv_h, actual.hsluv_h);
    assertFloatClose(expected.hsluv_s, actual.hsluv_s);
    assertFloatClose(expected.hsluv_l, actual.hsluv_l);
    assertFloatClose(expected.hpluv_h, actual.hpluv_h);
    assertFloatClose(expected.hpluv_p, actual.hpluv_p);
    assertFloatClose(expected.hpluv_l, actual.hpluv_l);
}

console.log("Loading snapshot ...");
const snapshotStr = fs.readFileSync('test/snapshot-rev4.json').toString('utf-8');
const snapshot = JSON.parse(snapshotStr);
console.log("Testing ...");

let conv = new Hsluv();
for (const hex of Object.keys(snapshot)) {
    let s = snapshot[hex];
    let sample = new Hsluv();
    sample.hex = hex;
    sample.rgb_r = s.rgb[0];
    sample.rgb_g = s.rgb[1];
    sample.rgb_b = s.rgb[2];
    sample.xyz_x = s.xyz[0];
    sample.xyz_y = s.xyz[1];
    sample.xyz_z = s.xyz[2];
    sample.luv_l = s.luv[0];
    sample.luv_u = s.luv[1];
    sample.luv_v = s.luv[2];
    sample.lch_l = s.lch[0];
    sample.lch_c = s.lch[1];
    sample.lch_h = s.lch[2];
    sample.hsluv_h = s.hsluv[0];
    sample.hsluv_s = s.hsluv[1];
    sample.hsluv_l = s.hsluv[2];
    sample.hpluv_h = s.hpluv[0];
    sample.hpluv_p = s.hpluv[1];
    sample.hpluv_l = s.hpluv[2];
    conv.hex = hex;
    conv.hexToHsluv();
    assertClose(conv, sample);
    conv.hsluv_h = sample.hsluv_h;
    conv.hsluv_s = sample.hsluv_s;
    conv.hsluv_l = sample.hsluv_l;
    conv.hsluvToHex();
    assertClose(conv, sample);
    conv.hpluv_h = sample.hpluv_h;
    conv.hpluv_p = sample.hpluv_p;
    conv.hpluv_l = sample.hpluv_l;
    conv.hpluvToHex();
    assertClose(conv, sample);
}

console.log("OK");

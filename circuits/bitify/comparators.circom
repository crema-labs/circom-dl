pragma circom 2.1.6;

include "./bitify.circom";

// Comparators for numbers
// Compare equality costs 2 constarints, this is "cheap" operation
// Compare 2 nums (>, >=, <, <=) forces us to bitify it, so it is more "expensive" operation, try to reduce it usage if u can
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// Compare in to zero, out is 0 or 1
template IsZeroDL() {
    signal input in;
    signal output out;
    
    signal inv;
    
    inv <-- in != 0 ? 1 / in : 0;
    
    out <==  -in * inv + 1;
    in * out === 0;
}

// Compare in[0] to in[1], out is 0 or 1
template IsEqualDL() {
    signal input in[2];
    signal output out;
    
    component isZero = IsZeroDL();
    
    isZero.in <== in[1] - in[0];
    
    isZero.out ==> out;
}

// Compare in[0] to in[1], out is 0 or 1 if enabled == 1 or always 0 if enabled == 0
template ForceEqualIfEnableDL() {
    signal input enabled;
    signal input in[2];
    
    component isEqual = IsEqualDL();
    isEqual.in <== in;
    (1 - isEqual.out) * enabled === 0;
}

// Compare in[0] < in[1], out is 0 or 1
template LessThanDL(LEN) {
    assert(LEN <= 252);
    signal input in[2];
    signal output out;
    
    component n2b = Num2BitsDL(LEN + 1);
    
    n2b.in <== in[0] + (1 << LEN) - in[1];
    
    out <== 1 - n2b.out[LEN];
}

// Compare in[0] <= in[1], out is 0 or 1
template LessEqThanDL(LEN) {
    signal input in[2];
    signal output out;
    
    component lessThan = LessThanDL(LEN);
    
    lessThan.in[0] <== in[0];
    lessThan.in[1] <== in[1] + 1;
    lessThan.out ==> out;
}

// Compare in[0] > in[1], out is 0 or 1
template GreaterThanDL(LEN) {
    signal input in[2];
    signal output out;
    
    component lt = LessThanDL(LEN);
    
    lt.in[0] <== in[1];
    lt.in[1] <== in[0];
    lt.out ==> out;
}

// Compare in[0] >= in[1], out is 0 or 1
template GreaterEqThanDL(LEN) {
    signal input in[2];
    signal output out;
    
    component lt = LessThanDL(LEN);
    
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    lt.out ==> out;
}


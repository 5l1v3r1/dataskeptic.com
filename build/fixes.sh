sed -i  -e 's/if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);//g' 'node_modules/core-js/modules/_typed-buffer.js'
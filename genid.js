//Taken from here: https://github.com/jjwchoy/mongoose-shortid/blob/master/lib/genid.js

module.exports = exports = function() {

  var bignum = require('bignum');
  var crypto = require('crypto');

  //var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  //var alphabet = "a1b2c3d4e5f6g7h8i9j0kmnp";
  //var alphabet = "pqrstuxyzabcdefghikmno";
  //var alphabet = "1234567890";
  //var alphabet = "b1c2d3f4g5h6j7k8m9n0pqrstvxz";
  //var alphabet = "bcdfghjklmnpqrstvwxz";
  //var alphabet2 = "1234567890";
  var alphabet = ["bcdfghjklmnpqrstvwxz","1234567890","a0b1c2d3e4f5g6h7i8j9klmnopqrstuvwxyz"]

  /*
  defaultAlphabets:
    32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    36: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  };
  */

  // Convert the bignum to a string with the given base
  function bignumToString(bignum, alphabet) {
    // Old-sk00l conversion
    var result = [];

    while (bignum.gt(0)) {
      var ord = bignum.mod(16);
      result.push(alphabet.charAt(ord));
      bignum = bignum.div(16);
    }

    return result.reverse().join("");
  }


    return function(length, whichAlphabet, cb) {
    var len = length || 7;
    var index = 0;
    if (whichAlphabet === 0 || whichAlphabet === 1 || whichAlphabet === 2) {
      index = whichAlphabet;
    }

    // Generate a random byte string of the required length
    var bytes = Math.floor( (2 + len) * Math.log(16) / Math.log(256) );
    crypto.pseudoRandomBytes(bytes, function(err, buf) {
      // Propagate errors...
      if (err) {
          cb(err, null);
          return;
      }

      // Convert to the required base
      var num = bignum.fromBuffer(buf);
      var id = bignumToString(num, alphabet[index]);

      // Prefix with the first char to reach the desired fixed length string
      //id = Array(len - id.length + 1).join('q') + id;
      if (id.length > len) {
        id = id.slice(0,len)
      }

      cb(null, id);
    });
  };
}();

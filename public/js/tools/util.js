////////////////////////
// UTILITIES

// debulked onresize handler
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,250);};return c;}


// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var consoleOutput = {
  isActive: false,
  activate: function(){
    this.isActive = true;
  },
  deActivate: function(){
    this.isActive = false;
  },
  log: function(args){
    if (this.isActive) {
      console.log.apply(console,arguments);
    }
  },
  error: function(args){
    console.error.apply(console,arguments);
    // if (this.isActive) {
    // console.error.apply(console,arguments);
    // }
  }
}


//Extend JS with clamp function
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

function lerpValues(value1, value2, t, out) {
  if (typeof value1 === 'number' && typeof value2 === 'number')
      return lerp(value1, value2, t)
  else { //assume array
    var len = Math.min(value1.length, value2.length)
    out = out||new Array(len)
    for (var i=0; i<len; i++)
      out[i] = lerp(value1[i], value2[i], t)
    return out
  }
}

var qAbs = Math.abs;
var qFloor = Math.floor;

/**
 * Version Compare
 * https://gist.github.com/TheDistantSea/8021359
 * @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
 * @license This function is in the public domain. Do what you want with it, no strings attached.
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

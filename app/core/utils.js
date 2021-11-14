'use strict'; // app/extend/helper.js

exports.toHump = name => {
  return name.replace(/\_(\w)/g, function(_all, letter) {
    return letter.toUpperCase();
  });
};

exports.toLine = name => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};


// LIBRARY FOT ENCRYPTED KEYS
var crypto = require('crypto');

module.exports.encrypt = function(key, data) {
    var cipher = crypto.createCipher('aes256', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}
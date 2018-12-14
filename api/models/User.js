/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
 var bcrypt = require("bcrypt");
 var _ = require("lodash");
module.exports = {

  attributes: {
    email: {
      type: "string",
      required: true,
      unique: true
    },
    password:{
      type: "string",
      minLength: 6,
      required: true,
      columnName: "encryptedPassword"
    },
  },
  customToJSON: function() {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['password'])
  },
  beforeCreate: function(values, cb){
		bcrypt.hash(values.password, 10, function (err, hash) {
      console.log(hash);
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
	},
  comparePassword: function(password, user) {
		return new Promise(function (resolve, reject) {
      bcrypt.compare(password, user.password, function (err, match) {
        if (err) reject(err);

        if (match) {
          resolve(true);
        } else {
          reject(false);
        }
      })
    });
	}

};

/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 var _ = require("lodash");
'use strict';
module.exports = {
  create: async function(req, res) {

    var allowedParameters = [
      "email", "password"
    ]

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(401).send({msj: "Password doesn't match"});
    }

    var data = _.pick(req.body, allowedParameters);

    var createdUser = await User.create(data)
    // Uniqueness constraint violation
    .intercept('E_UNIQUE', (err)=> {
      res.status(409).send('Uh oh: '+err.message);
      return 'emailAlreadyInUse';
    })
    .intercept((err)=>{
     // Return a modified error here (or a special exit signal)
     // and .create() will throw that instead
     res.status(409).send('Uh oh: '+err.message);
     return err;
    })
    .fetch();
    delete createdUser.password;
    var responseData = {
      user: createdUser,
      token: JwtService.issue({id: createdUser.id})
    }
    return res.status('200').send({msj: "User create", data: responseData});

  }

};

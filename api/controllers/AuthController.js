/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {

   login: function (req, res) {
     var email = req.param('email');
     var password = req.param('password');

     verifyParams(res, email, password);

     User.findOne({email: email}).then(function (user) {
       console.log(user);
       if (!user) {
         return invalidEmailOrPassword(res);
       }
       signInUser(req, res, password, user)
     }).catch(function (err) {
       return invalidEmailOrPassword(res);
     })
   }

 };


 function signInUser(req, res, password, user) {
   User.comparePassword(password, user).then(
     function (valid) {
       console.log('signInUser', valid);
       if (!valid) {
         return this.invalidEmailOrPassword(res);
       } else {
         var responseData = {
           user: user,
           token: generateToken(user.id)
         }
         return res.json(200, { msj: "Successfully signed in", data: responseData})
       }
     }
   ).catch(function (err) {
     console.log(err)
     return ResponseService.json(403, res, "Forbidden")
   })
 };


 function invalidEmailOrPassword(res){
   return ResponseService.json(401, res, "Invalid email or password")
 };

 function verifyParams(res, email, password){
   if (!email || !password) {
     return res.status(400).send("Email and password required");
   }
 };


 function generateToken(user_id) {
   return JwtService.issue({id: user_id})
 };

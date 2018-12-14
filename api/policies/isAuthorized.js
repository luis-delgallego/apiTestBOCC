module.exports = function (req, res, next) {
  let token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.status(401).send("Format is Authorization: Bearer [token]");
    }
  } else if (req.param('token')) {
    token = req.param('token');

    delete req.query.token;
  } else {
    return res.status(401).send("No authorization header was found");
  }

  JwtService.verify(token, function(err, decoded){
    if (err) return res.status(401).send("Invalid Token!");
    req.token = token;
    User.findOne({id: decoded.id}).then(function(user){
      req.current_user = user;
      next();
    })
  });

}

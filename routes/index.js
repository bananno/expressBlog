const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware');

// GET /
router.get('/', function(req, res, next) {
	return res.render('index', { title: 'Home' });
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
	User.findById(req.session.userId)
		.exec((error, user) => {
			if (error) {
				return next(error);
			} else {
        return res.render('profile', { 
          title: 'Profile', 
          name: user.name, 
          info: user.personalInfo 
        });
      }
		});
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', {title: 'Sign Up'});
});

//POST /register
router.post('/register', (req, res, next) => {
  if (req.body.email &&
    req.body.name &&
    req.body.personalInfo &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user type same password twice
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error("Passwords don't match!");
      err.status = 400;
      return next(err);
    }

    // create object with form input
    const userData = {
      email: req.body.email,
      name: req.body.name,
      personalInfo: req.body.personalInfo,
      password: req.body.password
    };

    // use schema's "create" method to insert document into Mongo
    User.create(userData, (err, user) => {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else {
    const err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }

});

module.exports = router;
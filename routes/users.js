var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fileupload = require('express-fileupload');

var User = require("../models/user");

var https = require('https');

'use strict';
const nodemailer = require('nodemailer');

// Register
router.get('/register', function(req, res) {
	res.render('register');
});

// Login
router.get('/login', function(req, res) {
	res.render('login');
});

// Homepage
router.get('/home', function(req, res) {
	res.render('home');
});

// All Team Members
router.get('/team', function(req, res) {
	res.render('team');
});

// All Industries
router.get('/industries', function(req, res) {
	res.render('industries');
});

// Contact
router.get('/contact', function(req, res) {
	res.render('contact');
});

// Individual Team Members
router.get('/davehopkins', function(req, res) {
	res.render('davehopkins');
});

router.get('/georgehostal', function(req, res) {
	res.render('georgehostal');
});

router.get('/joetameron', function(req, res) {
	res.render('joetameron');
});

router.get('/lloydlevidow', function(req, res) {
  res.render('lloydlevidow');
});

// Register User
router.post('/register', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	}	else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err,user)
		{ if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');

	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err,user){
   	if (err) throw err;
   	if (!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if (err) throw err;
   		if (isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}

   	});
   }); 
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login'
  	,failureFlash: true}),
  function(req, res) {
  	res.redirect('/');
  });


router.get('/logout', function(req, res){
	req.logout();
	
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
})


router.post('/formemail', function (req, res) {

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    console.log('Captcha response null');
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
	        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                if (success) {
                        console.log('Captcha success for newsletter subscription!');
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.message;

nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    	service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "azhthsvc", // provide in running env
            pass: "htharizon@"  // provide in running env
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'HTH-Levidow Arizona Website Mailer <azhthsvc@gmail.com>', // sender address
        to: 'Connie.Garay@azhth.com', // list of receivers
        subject: 'New Contact Form Message from HTH-Levidow Website - ' + name, // Subject line
        text: 'From: ' + name + 'E-mail:' + email + 'Message:' + message, // plain text body
        html: '<b>From: </b>' + name + '<br /><b>E-mail: </b>' + email + '<br /><br /><b>Message: </b>'  + message// html body
    };

 transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         	req.flash('error_msg', 'Contact form message failed to send. Please call us using the phone number in the contact section');

	res.redirect('contact');
    });
 	req.flash('success_msg', 'Contact form message sent! We will contact you back as soon as we can.');
 	res.redirect('contact');
});

                } else {
                        console.log('Captcha failed for form submission!');
                        req.flash('error_msg', 'Captcha failed for form submission. Please call us using the phone number in the contact section');
                        // and for the love of everyone, restore their inputs
                }
                 });
});

router.post('/resumeemail', function (req, res) {

	var message = "A new resume has been submitted from the HTH-Levidow website. Please see the file attached to this e-mail.";

nodemailer.createTestAccount((err, account) => {

	var attachments = [];

	 if (!req.files.file)
	 {
		req.flash('error_msg', 'File not found. Please use the choose file button in the Careers section to add a resume file.');
		res.redirect('contact');
	 }

	 else{
	 		let sampleFile = req.files.file;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    	service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "azhthsvc", // provide in running env
            pass: "htharizon@"  // provide in running env
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'HTH-Levidow Arizona Website Mailer <azhthsvc@gmail.com>', // sender address
        to: 'Connie.Garay@azhth.com', // list of receivers
        subject: 'New Resume Submitted from the HTH-Levidow Website - ', // Subject line
        text: message, // plain text body
        html: message// html body
    };
    attachments.push({
               filename: sampleFile.name,
               content: sampleFile.data
           });

                mailOptions.attachments = attachments;
           transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        }
        console.log(error);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         	req.flash('error_msg', 'Contact form message failed to send. Please call us using the phone number in the contact section');

	res.redirect('contact');
    });
 	req.flash('success_msg', 'Contact form message sent! We will contact you back as soon as we can.');
 	res.redirect('contact');
 }
});

});

router.post('/subscribe', function (req, res) {

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    console.log('Captcha response null');
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  if (req.body.email === null)
  {
  	req.flash('error_msg', 'E-mail address not provided. Please provide a valid e-mail address.');
  }
	        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
                if (success) {
                        console.log('Captcha success for newsletter subscription!');
					    var message = "A user from the HTH-Levidow website wants to subscribe to the Newsletter. Please add the provided e-mail address to the Newsletter group.";
						var email = req.body.email;

						nodemailer.createTestAccount((err, account) => {

					    // create reusable transporter object using the default SMTP transport
					    let transporter = nodemailer.createTransport({
					    	service: "gmail",
					        host: "smtp.gmail.com",
					        auth: {
					            user: "azhthsvc", // provide in running env
					            pass: "htharizon@"  // provide in running env
					        }
					    });

					    // setup email data with unicode symbols
					    let mailOptions = {
					        from: 'HTH-Levidow Arizona Website Mailer <azhthsvc@gmail.com>', // sender address
					        to: 'Connie.Garay@azhth.com', // list of receivers
					        subject: 'Newsletter Subscription Request from HTH-Levidow Website - ' + email, // Subject line
					        text: 'E-mail:' + email + 'Message:' + message, // plain text body
					        html: 'E-mail: </b>' + email + '<br /><br /><b>Message: </b>'  + message// html body
					    };

					 transporter.sendMail(mailOptions, (error, info) => {
					    if (error) {
					        }
					        console.log('Message sent: %s', info.messageId);
					        // Preview only available when sending through an Ethereal account
					        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					         	req.flash('error_msg', 'Contact form message failed to send. Please call us using the phone number in the contact section');

						res.redirect('contact');
					    });
					 	req.flash('success_msg', 'Contact form message sent! We will contact you back as soon as we can.');
					 	res.redirect('contact');
					});
                } else {
                        console.log('Captcha failed for newsletter subscription!');
                        req.flash('error_msg', 'Captcha failed for newsletter subscription. Please call us using the phone number in the contact section');
                        // and for the love of everyone, restore their inputs
                }
        });

	
});

var SECRET = "6LcOumUUAAAAAGViztNEL697GvSyjbMk2dom1W4f";

function verifyRecaptcha(key, callback) {
	console.log('Before HTTPs get');
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                callback(parsedData.success);
                        } catch (e) {
                                callback(false);
                        }
                });
        });
}

module.exports = router;
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

// Allows user to view posts from a category 
router.get('/show/:category', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category: req.params.category},{}, function(err, posts){
		res.render('index',{
			"title":req.params.category,
			"posts": posts
		});
	});
});

router.get('/add', function(req, res, next){
    res.render('addcategory',{
		"title":"Add Category"
	});
});

router.post('/add', function(req, res, next){
	// Get The Form Values
	var title = req.body.title;

	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();

	// Check for Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategory',{
			"errors": errors,
			"title": title
		});
	} else {
		var categories = db.get('categories');

		// Submit to Database
		categories.insert({
			"title": title
		}, function(err, category){
			if(err){
				res.send('There was an issue submitting the category');
			} else {
				req.flash('success','Category Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


module.exports = router;
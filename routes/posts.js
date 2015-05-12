var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next){
	var categories = db.get('categories');

	categories.find({},{}, function(err, categories){
		res.render('addpost',{
			"title": "Add Post",
			"categories": categories
		});
	});
});

router.post('/add', function(req, res, next){
	// Get Form Values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();
	
	
	if(req.files.mainimage){
		var mainImageOriginalName = req.files.mainimage.originalname;
		var mainImageName = req.files.mainimage.name;
		var mainImageMime = req.files.mainimage.mimetype;
		var mainImagePath = req.files.mainimage.path;
		var mainImageExt = req.files.mainimage.extension;
		var mainImageSize = req.files.mainimage.size;
	} else {
		var mainImageName = 'noimage.png';
	}
	
	// Validating the form
 	req.checkBody('title','Title must be entered').notEmpty();
	req.checkBody('body', 'Body section must be filled');
	
	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors,
			"title": title,
			"body": body
		});
	} else {
		var posts = db.get('posts');

		// Submit to DB
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainImageName
		}, function(err, post){
			if(err){
				res.send('There was an issue submitting the post');
			} else {
				req.flash('success','Your post was submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}

});

module.exports = router;
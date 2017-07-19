// User Information App - Web Server

// Create a Node.js application that is the beginning of a user management system. Your users are all saved in a "users.json" file, and you can currently do the following:
// - search for users
// - add new users to your users file.
// - get your starter file here: users.jsonView in a new window

// Part 0
// Create one route:
// - route 1: renders a page that displays all your users.

// Part 1
// Create two more routes:
// - route 2: renders a page that displays a form which is your search bar.
// - route 3: takes in the post request from your form, then displays matching users on a new page. Users should be matched based on whether either their first or last name contains the input string.

// Part 2
// Create two more routes:
// - route 4: renders a page with three forms on it (first name, last name, and email) that allows you to add new users to the users.json file.
// - route 5: takes in the post request from the 'create user' form, t

// User Information App - AJAX Server

// Remember you are only allowed to call  "response.send" once per request!

// Part 1: Autocomplete
// Modify your form so that every time the user enters a key, it makes an AJAX call that populates the search results.
// Do this work in a git branch called "autocomplete". Then, merge this branch into master with a pull request.

// Part 2: Bandwidth optimization
// Modify your form again so that AJAX requests happen at most once every 300 milliseconds.
// Do this work in a git branch called "bandwidth-optimization". Then, merge this branch into master with a pull request.

// Hints:

// Use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now (Links to an external site.)Links to an external site. (Links to an external site.)Links to an external site.
// Test it by opening the Network tab in Chrome's Developer Tools by checking that fewer requests are going off.

//loading in all the required modules for the app to work
const express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

//setting the pug engine as the view engine, loading in a css file, and activating bodyParser moduel
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'css')));
app.use(bodyParser.urlencoded({ extended: true }));

//homepage which is the search bar to search for users
app.get('/', function(req, res){
	res.render('form')
});

//user page which lists all of the users in the json file by reading and parsing it
app.get('/users', function (req, res) {
	var obj;	

	fs.readFile("../users.json", 'utf8', function (err, data) {		
		if (err) {
			throw err;					
		} 
		var obj = JSON.parse(data);
	
		res.render('users', {
			title: 'List of Users',
			users: obj,
		});	
	});
});

//post request for a search result on the homepage, this will compare the entered name against the names
//in the json file of users
//updated: also includes the processing of the autocomplete results in search bar
app.post('/searchresult', function (req,res){
	// console.log(req.body);
	var name = req.body.name;
	var autoName = req.body.autoname;
	var autoUser = [];

	fs.readFile("../users.json", 'utf8', function (err, data) {		
		if (err) {
			throw err;					
		} 
		var obj = JSON.parse(data);

		if (name) {
			for (var i=0; i<obj.length; i++) {
				if ((name === obj[i].firstname) || (name === obj[i].lastname)) {
					var result = obj[i];
				} 
			}; res.render('searchresult', {match: result}); 
		} else {
			if (autoName.length === 0) {
				autoUser = [];
			} else {
				for (var i=0; i<obj.length; i++) {
					var include = obj[i].firstname.includes(autoName);
					var include2 = obj[i].lastname.includes(autoName)
					if ((include === true) || (include2 === true)) {
						autoUser.push(obj[i]);	
					};
				};res.send({complete: autoUser});
		};
		};
	});
});

//the page with the form to add a new user
app.get('/adduser', function (req,res) {
	res.render('adduser');
});

//post request triggered by someone adding a new user, it will read and parse the json, then push in the data
//then change the file back into a json file, then redirecting to the users page to show the new user added
app.post('/addusers', function (req,res) {

	fs.readFile("../users.json", 'utf8', function (err, data) {		
		if (err) {
			throw err;					
		} 
		var json = JSON.parse(data);
		json.push({
			firstname: req.body.firstname, 
			lastname: req.body.lastname,
			email: req.body.email
		})
		fs.writeFile("../users.json", JSON.stringify(json), function (err, data) {		
		if (err) {
			throw err;					
		} else {
			console.log("User added")
		}	
	}); 
	res.redirect('/users');
	});
});

//sets the app to listen at port 3003 for incoming user requests
app.listen(3003, function () {
  console.log('Example app listening on port 3003!')
});
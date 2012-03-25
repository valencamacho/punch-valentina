var requestURL = require('request');
var express = require('express'); 
var ejs = require('ejs'); //embedded javascript template engine

var app = express.createServer(express.logger());

//var http = require('http');

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/* var requestURL= require('request'); */

/*
var test = require('test');
test.f();
*/

/* var join = require("hunch").getAuthSig(); */

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Finding = mongoose.model('Finding');

/************* END DATABASE CONFIGURATION *********/




/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/



// main page 
app.get('/', function(req, res) {
    
    // the url you need to request from hunch
    url = "http://api.hunch.com/api/v1/get-recommendations/?auth_token=6275cb220d05d45e411be1358cdcd7a765a1c80b&topic_ids=list_book&reverse"

    // make the request to Hunch api
    requestURL(url, function (error, response, hunchJSON) {
        
        // if successful
        if (!error && response.statusCode == 200) {

            // convert hunchJSON into JS object, hunchData
            hunchData = JSON.parse(hunchJSON);

            // prepare template variables
            var templateData = {
                'url' : url,
                'totalRecs' : hunchData.total,
                'hunchRecs' : hunchData.recommendations
            }
            
            // render the template with templateData
            res.render("hunch_display.html",templateData)
        }
    });

});
// end of main page



app.post('/', function(request,response){

  /*
 console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
*/
    
    // Simple data object to hold the form data
    
var newLike = {
		title:request.bogy.title,
        item : request.body.item,
        description : request.body.description,
        recommend : request.body.recommend,
        image : request.body.image,
       
    };
    
    
     // create a new entry
    var entry = new Finding(newLike);
    
    // save the new entry
    entry.save();
    

	response.redirect('/finding/'+ entry._id);
	 
});


app.get("/join", function(request, response) {
	response.render('join.html');
});


app.post('/ajax-save', function(request, response){
	
	console.log("incoming data");
	console.log(request.body.title);
	
	var newLike = {
		title : request.body.title,
        item : request.body.item,
        description : request.body.description,
        recommend : request.body.recommend,
        image : request.body.image,
       
    };
    
    
     // create a new entry
    var entry = new Finding(newLike);
    
    // save the new entry
    entry.save();
    
    result = {
    	status : 'saved'
    };
    
    response.json(result)
    
});


app.get('/finding/:objectid', function(request, response){
	 Finding.findById(request.params.objectid,function(err,post){
	        if (err) {
	            console.log('error');
	            console.log(err);
	            response.send("uh oh, can't find that recommendation");
	        }
	        
	          // build the query
	    var query = Finding.find({});
	    query.sort('date',-1); //sort by date in descending order
	    
	    // run the query and display blog_main.html template if successful
	    query.exec({}, function(err, allPosts){
	        
	        // prepare template data
	        templateData = {
	            post : allPosts
	        };     
	          
	          console.log(post); 
	
	        
	        // found the blogpost
	        response.render('findings.html', templateData);
	    });
	});
});


// return all blog entries in json format
app.get('/json/allposts', function(request, response){

    // define the fields you want to include in your json data
   
    includeFields = ['item','image','date']

    // query for all blog
    queryConditions = {}; //empty conditions - return everything
    var query = Finding.find( queryConditions, includeFields);

    query.sort('date',-1); //sort by most recent
    query.exec(function (err, finding) {

        // render the card_form template with the data above
        jsonData = {
          'status' : 'OK',
          'posts' : finding
        }

        response.json(jsonData);
    });
});



// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

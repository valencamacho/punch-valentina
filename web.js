var requestURL = require('request');
var express = require('express'); 
var ejs = require('ejs'); //embedded javascript template engine

var app = express.createServer(express.logger());

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/* HUNCH API AUTH CONFIG */
var crypto = require('crypto')
var shasum = crypto.createHash('sha1');

hunch = {
    app_id : '3147671',
    app_secret : 'a1082861f27bce308ba4cf7940b71324ab8b7b05'
};
/* END HUNCH API AUTH CONFIG */

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
    
	// USE COOKIES
    app.use(express.cookieParser());

    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/


// main page 
app.get('/', function(request, response) {
    
    // main page - rather boring right now
    /* response.render("join.html") */
    response.render("index.html")
    
});

//end of main page

app.get("/login", function (request, response){

	response.redirect('http://www.hunch.com/authorize/v1/?app_id='+hunch.app_id);


});


app.get('/hunchcallback', function (request, response){

	//get query string from hunch callback
	auth_token_key = request.query.auth_token_key
	user_id = request.query.user_id
	next = request.query.next
	
	appDict ={
		'app_id' : hunch.app_id,
		'auth_token_key' : auth_token_key	
	}
	
	authSig = getAuthSig(appDict);
	
	get_token_request_url = "http://api.hunch.com/api/v1/get-auth-token/?app_id="+hunch.app_id+"&auth_token_key="+auth_token_key+"&auth_sig="+authSig;


//Request the auth_token from Hunch
	requestURL(get_token_request_url, function(error, httpResponse, data){
		
		if( !error && httpResponse.statusCode ==200){
		
			hunchData = JSON.parse(data);
			
			if(hunchData.status == "accepted"){
				auth_token = hunchData.auth_token;
				user_id = hunchData.user_id;
				response.cookie('user_id', user_id, { expires: new Date(Date.now() + (24*4*900000) ), httpOnly: true });
				response.cookie('auth_token', auth_token, { expires: new Date(Date.now() + (24*4*900000) ), httpOnly: true });

				
				response.redirect("/recommendations/");
			}else {
				//eror with hunch response
				response.send("uhoh something went wrong…<br><pre>"+JSON.stringify(hunchData)+"</pre>");	
			}


		} else {
		//not able to get a response from hunch
		response.send("Error occurred when trying to fetch : "+get_token_request_url)
		}
	});
});



app.post('/home', function(request,response){

  /*
 console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
*/
    
    // Simple data object to hold the form data
   	var newLike = request.body;

/*
	var newLike = {
		title:request.body.title,
        item : request.body.item,
        description : request.body.description,
        recommend : request.body.recommend,
        image : request.body.image,
     }; */
    
    
     // create a new entry
    var entry = new Finding(newLike);
    
    // save the new entry
    entry.save();
    

	response.redirect('/'+ entry._id);
	
	 
});


/*
app.get("/join", function(request, response) {
	response.render('join.html');
});
*/


app.post('/ajax-save', function(request, response){
	
	console.log("incoming data :",request.body);
	var newLike = request.body;
/*
	var newLike = {
		title : request.body.title,
        item : request.body.item,
        description : request.body.description,
        recommend : request.body.recommend,
        image : request.body.image,
       
    };
*/
    
    
     // create a new entry
    var entry = new Finding(newLike);
    
    // save the new entry
    entry.save(function(error){
    	if (error) throw error;
    	result = {
    		status : 'saved'
    	};
    	response.json(result);
    });
    
    
    
});



app.get('/findings', function(request, response){

	
	Finding.find({ 'user_id': request.cookies.user_id}, function (err, findings) {
  // docs is an array
	        if (err) {
	            console.log('error');
	            console.log(err);
	            return response.send("uh oh, can't find that recommendation");
	        }
			var templateData = {'findings' : findings};
	        response.render("findingstest.html",templateData);
   
        });

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
	        	'url' : url,
                'totalRecs' : hunchData.total,
                'hunchRecs' : hunchData.recommendations

	        }     
	          
	          console.log(post); 
	
	        
	        // found the blogpost
	        response.render("findings.html", templateData);
	    });
	});
});


/*
// return all blog entries in json format- my API!!!
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

*/


/***************  GET RECOMMENDATIONS BY AUTH_TOKEN  ****************/
app.get('/recommendations/', function(request , response) {
    
    // get the auth token from the url
    auth_token = request.cookies.auth_token
    /* user_id = request.params.query.user_id */
  /*
  
    var cutfactor = 20;
    var maxresults = 4000;
*/
    var topics = "list_movie";
   /*  var counter = 0; */
    // the url you need to request from hunch
    /*
    var val=counter * cutfactor;
    
    url = "http://api.hunch.com/api/v1/get-recommendations/?auth_token="+auth_token+"&topic_ids="+topics+"&limit=1&offset="+val+"&reverse"
    
    */
    //url = "http://localhost:5000/myhunch.json"
    url = "http://api.hunch.com/api/v1/get-recommendations/?auth_token="+auth_token+"&topic_ids="+topics+"&limit=500&reverse"
    
    // make the request to Hunch api
    requestURL(url, function (error, httpResponse, hunchJSON) {
       
	        if (!error && httpResponse.statusCode == 200) {
	
	            // convert hunchJSON into JS object, hunchData
	            hunchData = JSON.parse(hunchJSON);
				
							
	            // prepare template variables
	            var templateData = {
	            	
	            	'user_id'	: request.cookies.user_id,
	                'url' 		: url,
	                'totalRecs' : hunchData.total,
	                'hunchRecs' : hunchData.recommendations
	            }
	            
	            // render the template with templateData
	            response.render("hunch_display.html",templateData)
	        }
    });

});
/***************  END RECOMMENDATIONS BY AUTH_TOKEN  ****************/

/********** Functions for Hunch Authentication ******************/
function urlencode(x) {
    return escape(x).replace('+','%2B').replace('/','%2F').replace('@','%40').replace('%20','+');
}

function getAuthSig(queryDict) {
    APP_SECRET = hunch.app_secret;

    /* shasum.update(null); */
	var shasum = crypto.createHash('sha1');

    var keys = [];
    for (var key in queryDict)
        keys.push(key);
    	keys.sort();
    
    var queries = [];
    for (var i in keys)
        queries.push( urlencode(keys[i]) + '=' + urlencode(queryDict[keys[i]]) );
    var data = queries.join('&') + APP_SECRET;
    
    console.log(data);
    shasum.update(data);
    return shasum.digest('hex');

}







// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

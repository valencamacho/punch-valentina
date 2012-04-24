
// wait for page contents to load: 
// add page load listener
window.onload = function () {
    tryFindSketch();
    
    setInterval(getSpiralValue, 100);
    setInterval(findClosestRec, 1000); //1 second delay on filtering recommendation rows
    
}

var zoomOutSketch;
var adjustedHunchRecNum;

var currentClosestRec = null;
var currentClosestDifference = 0;



function tryFindSketch () {
//    var zoomOutSketch = Processing.instances[0];
//    if ( zoomOutSketch == undefined ) 
//        return setTimeout(tryFindSketch, 200);  // try again ..
    
    // get slider from DOM
    //var range = document.getElementById("form-range");
    // add listener
    //range.onchange = function () {
        //sketch.newRangeValue( range.value );
    //}
}

var getSpiralValue = function() {
	spiralNumDiv = document.getElementById('spiralNumberContainer');
	
	adjustedHunchRecNum = Processing.instances[0].mapTheNumbers(1.5,1.8);
	//Processing.instances[0].getHunchRange() ); 
	spiralNumDiv.innerHTML = Processing.instances[0].getHunchRange() + "   adjusted: " + adjustedHunchRecNum;
	console.log(" adjustedHunchRecNum = " + adjustedHunchRecNum + ", spiralNumDiv.innerHTML " + spiralNumDiv.innerHTML + " " );
	//console.log( Processing.instances[0].getHunchRange() ); 
}
 
 
/*
var hunchRecs.length = function (){
	spiralHunch= document.get
	}
*/

var findClosestRec = function() {
	currentClosestRec = null;
	currentClosestDifference = 0.0;

	jQuery("div.recommendation").each( function(i, currentRec) { 
	
		var recommendationDiff = Math.abs( jQuery(currentRec).data('hunchstars') - adjustedHunchRecNum );
	
		if (currentClosestRec == null) {
			currentClosestRec = currentRec;
			currentClosestDifference = recommendationDiff;
			
		} else {
			
			//is this the winner?
			if (recommendationDiff < currentClosestDifference) {
				currentClosestRec = currentRec;
				currentClosestDifference = recommendationDiff;
				
			}
		
		}
			
		//console.log( 'adjusted hunch # = ' + adjustedHunchRecNum + '   current winner is: ' + jQuery(currentClosestRec).data('hunchstars') );
	
	} );
	
	//show and hide of recommendations
	jQuery('div.recommendation').hide(); //hide all
	
	jQuery(currentClosestRec).show();
	jQuery(currentClosestRec).prev().show();
	jQuery(currentClosestRec).next().show();
}
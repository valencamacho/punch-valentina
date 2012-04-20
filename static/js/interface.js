
// wait for page contents to load: 
// add page load listener
window.onload = function () {
    tryFindSketch();
    
    setInterval(getSpiralValue, 100);
    
}

var zoomOutSketch;
var adjustedHunchRecNum;

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
	
	spiralNumDiv.innerHTML = Processing.instances[0].getHunchRange() + "   adjusted: " + adjustedHunchRecNum;
	//console.log( Processing.instances[0].getHunchRange() ); 
}
 
 
/*
var hunchRecs.length = function (){
	spiralHunch= document.get
	}
*/

// wait for page contents to load: 
// add page load listener
window.onload = function () {
    tryFindSketch();
    
    setInterval(getSpiralValue, 100);
    
}

var zoomOutSketch;

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
	spiralNumDiv.innerHTML = Processing.instances[0].getHunchRange();
	console.log( Processing.instances[0].getHunchRange() ); 
}
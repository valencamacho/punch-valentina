// HOMEPAGE SCROLL FANCYNESS



$(document).ready(init);

function init() {
	/* ========== DRAWING THE PATH AND INITIATING THE PLUGIN ============= */

	$.fn.scrollPath("getPath")
		// Move to 'start' element
		.moveTo(400, 50, {name: "start"})
		// Line to 'description' element
		.lineTo(400, 800, {name: "description"})
		// Arc down and line to 'syntax'
		.arc(200, 1200, 400, -Math.PI/2, Math.PI/2, true)
		.lineTo(600, 1600, {
			callback: function() {
				highlight($(".settings"));
			},
			name: "syntax"
		})
		// Continue line to 'scrollbar'
		.lineTo(1750, 1600, {
			callback: function() {
			
				highlight($(".sp-scroll-handle"));
			},
			name: "scrollbar"
		})
		// Arc up while rotating
		.arc(1800, 1000, 600, Math.PI/2, 0, true, {rotate: Math.PI/2 })
		// Line to 'rotations'
		.lineTo(2400, 750, {
			name: "rotations"
		})
		// Rotate in place
		.rotate(3*Math.PI/2, {
			name: "rotations-rotated"
		})
		// Continue upwards to 'source'
		.lineTo(2400, -700, {
			name: "source"
		})
		// Small arc downwards
		.arc(2250, -700, 150, 0, -Math.PI/2, true)

		//Line to 'follow'
		.lineTo(1350, -850, {
			name: "follow"
		})
		// Arc and rotate back to the beginning.
		.arc(1300, 50, 900, -Math.PI/2, -Math.PI, true, {rotate: Math.PI*2, name: "end"});

	// We're done with the path, let's initate the plugin on our wrapper element
	$(".wrapperhome").scrollPath({drawPath: true, wrapAround: true});

	// Add scrollTo on click on the navigation anchors
	$(".navigation").find("a").each(function() {
		var target = this.getAttribute("href").replace("#", "");
		$(this).click(function(e) {
			e.preventDefault();
			
			// Include the jQuery easing plugin (http://gsgd.co.uk/sandbox/jquery/easing/)
			// for extra easing functions like the one below
			$.fn.scrollPath("scrollTo", target, 1000, "easeInOutSine");
		});
	});

	/* ===================================================================== */

	$(".settings .show-path").click(function(e) {
		e.preventDefault();
		$(".sp-canvas").toggle();
	}).toggle(function() {
		$(this).text("Hide Path");
	}, function() {
		$(this).text("Show Path");
	});

	$(".tweet").click(function(e) {
		open(this.href, "", "width=550, height=450");
		e.preventDefault();
	});

	$.getJSON("http://cdn.api.twitter.com/1/urls/count.json?callback=?&url=http%3A%2F%2Fjoelb.me%2Fscrollpath",
			function(data) {
				if(data && data.count !== undefined) {
					$(".follow .count").html("the " + ordinal(data.count + 1) + " kind person to");
				}
			});
	}


function highlight(element) {
	if(!element.hasClass("highlight")) {
		element.addClass("highlight");
		setTimeout(function() { element.removeClass("highlight"); }, 2000);
	}
}
function ordinal(num) {
	return num + (
		(num % 10 == 1 && num % 100 != 11) ? 'st' :
		(num % 10 == 2 && num % 100 != 12) ? 'nd' :
		(num % 10 == 3 && num % 100 != 13) ? 'rd' : 'th'
	);
}




// END OF HOMEPAGE SCROLL FANCYNESS











// SCRIPT JS // AJAX ADD TO FINDINGS


jQuery(document).ready(function(){ 

	jQuery('form').submit( function(e) {
	
		allInputs = jQuery(this).find('input');
		console.log("# of inputs : "+ allInputs.length);

		//prepare data for ajax-save submission
		ajaxDataToSend = {};
		
		for(i=0; i < allInputs.length; i++) {
			ajaxDataToSend[ jQuery(allInputs[i]).attr('name') ] =jQuery(allInputs[i]).val();
		}
		
		console.log(ajaxDataToSend);
		
		jQuery.ajax({
			url : '/ajax-save',
			dataType : 'json',
			type : 'POST',
			data: ajaxDataToSend, 
			success : function(response) {
				console.log("received from ajax");
				console.log(response);
			},
			error : function() {
				alert("uhoh");
			}
		})
		e.preventDefault();
		return false;
	});
});


// END OF SCRIPT JS // AJAX ADD TO FINDINGS


// wait for page contents to load: 
// add page load listener
window.onload = function () {
    tryFindSketch();
    
    setInterval(getSpiralValue, 100);
    setInterval(findClosestRec, 1000); //1 second delay on filtering recommendation rows
    
}

var zoomOutSketch;
var adjustedHunchRecNum;
//var shortListRecs;
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
	
	adjustedHunchRecNum = Processing.instances[0].mapTheNumbers(1.14,3.2);
	//Processing.instances[0].getHunchRange() ); 
	spiralNumDiv.innerHTML = Processing.instances[0].getHunchRange() + "   adjusted: " + adjustedHunchRecNum;
	/* console.log(" adjustedHunchRecNum = " + adjustedHunchRecNum + ", spiralNumDiv.innerHTML " + spiralNumDiv.innerHTML + " " ); */
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
	
	
	
	jQuery('div.recommendation').hide().removeClass('selected prev next'); //hide all
	
	jQuery(currentClosestRec).show().addClass('selected');
	jQuery(currentClosestRec).prev().show().addClass('prev');
	jQuery(currentClosestRec).next().show().addClass('next');

	}
	
	
	
	
	// HELPER FUNCTIONS
	
	
	function convertToSlug(Text)
        {
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-')
                ;
        }

        jQuery(document).ready(function() {

            jQuery('#title').change(function(e){
                var currentTitle = jQuery(this).val();
                jQuery("#urlslug").val(convertToSlug(currentTitle));

            });

        });

	
	
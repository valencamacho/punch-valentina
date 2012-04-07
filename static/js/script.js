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
		
		
		var displayContent = function(content){
			$(result).btn.btn-primary.addClass('agregado');
		
		
		};
		
		
		jQuery.ajax({
			url : '/ajax-save',
			dataType : 'json',
			type : 'POST',
			data: ajaxDataToSend, 
			
			success : function(response) {
				console.log("received from ajax");
				console.log(response);
				displayContent(response);
				
			},
			error : function() {
				alert("uhoh");
			}
		
		})
		
		e.preventDefault();
		return false;
		
	});

});
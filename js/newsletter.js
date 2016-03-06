jQuery.noConflict()(function(jQuery){
	jQuery('#cache').hide();
	jQuery(document).ready( function(){
			// Hide all Modal Boxes
			jQuery('div.modal-box').hide();
			// Display appropriate box on click - adjust this as required for your website
			jQuery('span.modal-link').click(function() {
				var modalBox = jQuery(this).attr('rel');
				jQuery('div'+modalBox).fadeIn('slow');
				jQuery('#cache').fadeIn('fast');
			});
			// Multiple ways to close a Modal Box
			jQuery('span.modal-close').click(function() {
				jQuery(this).parents('div.modal-box').fadeOut('slow');
				jQuery('#cache').fadeOut('fast');
			});
			jQuery('span.dismiss').click(function() {
				jQuery(this).parents('div.modal-box').fadeOut('slow');
				jQuery('#cache').fadeOut('fast');
			});
			jQuery('span.save').click(function() {
				// **** If you need to save or submit information - add your appropriate ajax code here
				jQuery(this).parents('div.modal-box').fadeOut('slow');
				jQuery('#cache').fadeOut('fast');
			});
		});
});
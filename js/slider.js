jQuery.noConflict()(function(jQuery){

	"use strict";
	
	//fonction pour le changement de slide dans service
	function changeslide(liClick, unSlide) {
		//metrre l'icone du slider actif et clique en orange
		jQuery("#navigationslider>li").removeClass();
		liClick.parent().toggleClass("click");
		
		//changement de slide
		unSlide.parent().children().removeClass();
		unSlide.toggleClass("courant");
								
		unSlide.siblings().addClass("cache");
		setTimeout(function (){
			unSlide.siblings();
		},1000);
	}
	//fonction pour la nav pour qu'au click on reste sur l'img
	function changesnav(classe) {
		jQuery("nav>li>a>span").removeClass("txtchange");
		classe.toggleClass("txtchange");
	}
	
/*----------------------------------fin partie des fonctions---------------------------------------*/

	jQuery('#slider').addClass("slider");
	
	//pour le slider dans services
	jQuery('#navigationslider').on("click","a", function(event) {
		event.preventDefault();
		//pour savoir sur ki on a cliquer
		var liClick = jQuery(this);		
		var pos = jQuery(this).attr("href");
		var slideDuLien = jQuery(pos);		
		console.log(pos);
		//voir fontion changesslide qui mlet le rond cliqué en orange
		changeslide(liClick, slideDuLien);
	});
	
	//modifier icone avec scroll
	jQuery(document).scroll(function(){
		if (!autoScroll) {
			var scroll = jQuery('html').scrollTop()+20;
			var scrollShare = jQuery('#ShareYourRecipe').offset().top;
			var scrollNous = jQuery('#Nous').offset().top;
			var scrollServices = jQuery('#Services').offset().top;
			var scrollFAQ = jQuery('#FAQ').offset().top;
			
			if (scroll > scrollFAQ) {
				var classe = jQuery(".txtFAQ");
				changesnav(classe);
			}
			 else if (scroll > scrollServices) {
				var classe = jQuery(".txtplus");
				changesnav(classe);
				console.log("dans services");
			}
			else if (scroll > scrollNous) {
				var classe = jQuery(".txtnous");
				changesnav(classe);
			}
			else if (scroll > scrollShare) {
				var classe = jQuery(".txtconcept");
				changesnav(classe);
			}
		}
	});
	
	//pour le sprite quand click lien header
	jQuery('header').on("click","a", function(event) {
		event.preventDefault();
		var pos = jQuery(this).attr("href");
		console.log(pos);
		
		//chagement classe suivant la pos de a
		if (pos == "#ShareYourRecipe") {
			var classe = jQuery(".txtconcept");
			changesnav(classe);
		}
		else if (pos == "#Nous") {
			var classe = jQuery(".txtnous");
			changesnav(classe);
		}
		else if (pos == "#Services") {
			var classe = jQuery(".txtplus");
			changesnav(classe);
		}
		else if (pos == "#FAQ") {
			var classe = jQuery(".txtFAQ");
			changesnav(classe);
		}
		else {
			var classe = jQuery("");
			changesnav(classe);
		}
	});
	
	jQuery(document).scroll(function(){
		var scroll = jQuery('html').scrollTop();
		console.log(scroll);
	});
	
});
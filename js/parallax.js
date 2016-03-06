jQuery.noConflict();

/* On utilise le mode strict */
"use strict";

jQuery.noConflict()(function(jQuery){

	function getWindowHeight() {
		var windowHeight=0;
		if (typeof(window.innerHeight)=='number') {
			windowHeight=window.innerHeight;
		} else {
			if (document.documentElement && document.documentElement.clientHeight) {
				windowHeight = document.documentElement.clientHeight;
			} else {
				if (document.body && document.body.clientHeight) {
					windowHeight=document.body.clientHeight;
				}
			}
		}
		return windowHeight;
	}
							
	function parallax(){

		
		scrollTopCur = jQuery(document).scrollTop(); // distance par rapport au haut du document
		heightCur = jQuery(document).height();       // hauteur du document 
		windowHeight = getWindowHeight();       // hauteur "utile" de la fenêtre

	//PATES
    jQuery('#pates1erplan').css(
        "background-position",
        "10% " +
        Math.round(windowHeight - 2200 - (scrollTopCur + windowHeight - heightCur) / 3)
        + "px"
    );
    jQuery('#pates2emeplan').css(
        "background-position",
        "0% " +
        Math.round(windowHeight - 2500 - (scrollTopCur + windowHeight - heightCur) / 2)
        + "px"
    );
    jQuery('#pates3emeplan').css(
        "background-position", 
        "30% " + 
        Math.round(windowHeight - 3100 - (scrollTopCur + windowHeight - heightCur) / 1.5) 
        + "px"
    );

	//EAU
	jQuery('#eau1erplan').css(
        "background-position",
        "80% " +
        Math.round(windowHeight - 1000 - (scrollTopCur + windowHeight - heightCur) / 3)
        + "px"
    );
    jQuery('#eau2emeplan').css(
        "background-position",
        "100% " +
        Math.round(windowHeight - 2150 - (scrollTopCur + windowHeight - heightCur) / 2)
        + "px"
    );
    jQuery('#eau3emeplan').css(
        "background-position", 
        "70% " + 
        Math.round(windowHeight - 2000 - (scrollTopCur + windowHeight - heightCur) / 2) 
        + "px"
    );
	
	//OEUF
	jQuery('#oeuf1erplan').css(
        "background-position",
        "100% " +
        Math.round(windowHeight - 1800 - (scrollTopCur + windowHeight - heightCur) / 2)
        + "px"
    );
    jQuery('#oeuf2emeplan').css(
        "background-position",
        "100% " +
        Math.round(windowHeight - 1550 - (scrollTopCur + windowHeight - heightCur) / 1.4)
        + "px"
    );
	
	//LARDONS
	jQuery('#lardons1erplan').css(
        "background-position",
        "10% " +
        Math.round(windowHeight - 1500 - (scrollTopCur + windowHeight - heightCur) / 1.2)
        + "px"
    );

	
	//SEL
	jQuery('#sel1erplan').css(
        "background-position",
        "50% " +
        Math.round(windowHeight - 1000 - (scrollTopCur + windowHeight - heightCur) / 2)
        + "px"
    );
    jQuery('#sel2emeplan').css(
        "background-position",
        "0% " +
        Math.round(windowHeight - 950 - (scrollTopCur + windowHeight - heightCur) / 1.5)
        + "px"
    );
    jQuery('#sel3emeplan').css(
        "background-position", 
        "40% " + 
        Math.round(windowHeight - 1000 - (scrollTopCur + windowHeight - heightCur) / 2) 
        + "px"
    );
	
		
	}

	jQuery(function(){
		parallax();                     // calcul au chargement de la page
		jQuery(window).scroll(parallax);     // calcul au défilement de la page
		jQuery(window).resize(parallax);     // calcul au redimensionnement de la page
	});
});
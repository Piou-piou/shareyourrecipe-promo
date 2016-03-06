/**
 * #############################################################################
 *
 * scroller
 * 
 * défilement doux de la page, notamment pour les liens vers des ancres
 * 
 * @author      Erwan Lefèvre <erwan.lefevre@gmail.com>
 * @copyright   Erwan Lefèvre 2010
 * @license     Creative Commons - Paternité 2.0 France
				http://creativecommons.org/licenses/by/2.0/fr/
 * @version     v2.2.0, 2010-12-13
 * @compatibility	v2.2.0 : compatiblité assurée avec Firefox 1.5+, IE 5.5+,
 *					Safari, Chrome, Opera.
 * 					Autre versions et navigateurs non testés
 * 
 * #############################################################################
 */
(function(window, document, undefined){



/**
 * transfer
 * =============================================================================
 * retourne un objet contenant les propriétés et méthodes de l'objet /dest/,
 * complétées et/ou écrasées par celles de l'objet /source/
 *
 * @param       source       {object}        l'objet source
 * @param       dest         {object}        l'objet de destination
 * @return      {object}
 *
 */
function transfer (source, dest) {
    var prop, transfered={};
    for ( prop in dest ) { transfered[prop] = dest[prop]; }
    for ( prop in source ) { transfered[prop] = source[prop]; }
    return transfered; 
}





/**
 * preventDefault()
 * 
 * permet d'annuler l'effet normal d'un événement sur un élément html
 * (revient à faire un "return false" pour cet événement, en passant par le event-handeler)
 *
 * v1.0 - 2010-05-30
 * 
 * @returns		void
 * 
 * =============================================================================
 */
function preventDefault(e){
	e = e||event;
	if (e.preventDefault) { e.preventDefault(); }
	else { e.returnValue = false;  }
}




/** 
 * newFunc v1.0, 2010-11-02
 * 
 * Crée une fonction fn anonyme, qui appellera la fonction /fn/, en lui passant
 * les arguments arg.
 * Sert principalement à créer des fonctions en boucle.
 *
 * @param			{Function}		fn						modèle de fonction à créer
 * @param			{Mixed}			arg1, arg2, etc			arguments à passer dans le modèle
 * 
 * @returns			{Function}
 * 
 * =============================================================================
 */
function newFunc( fn ){
	var i = 1, // 1, et non 0, pour ne pas prendre en compte fn
		max = arguments.length,
		args = [];
	for ( ; i < max; i++ ) args.push( arguments[ i ] );
	return function() {
		fn.apply( this, args );
	};
}




/**
 * addEvent
 * 
 * ajoute la fonction /fn/ à la pile de résolution de l'événement /evenType/ de
 * l'objet /obj/
 * 
 * merci à : http://www.scottandrew.com/weblog/articles/cbs-events
 *
 * @param		{Mixed}				obj			window, ou document, ou un élément HTML
 * @param		{String}			evType		type d'event (click, mouseover, mouseout, etc.…)
 * @param		{String}			fn			la fonction à ajouter
 * @param		{Boolean}			useCapture	"useCapture un booléen : true pour la phase de capture, ou false pour la phase de bouillonnement et la cible. On utilise quasiment toujours la valeur false." (cf : http://www.alsacreations.com/article/lire/578-La-gestion-des-evenements-en-JavaScript.html)
 * 
 * @returns		void
 * 
 * =============================================================================
 */
function addEvent ( obj, evType, fn, useCapture ) {
	if ( obj.addEventListener ) { obj.addEventListener(evType, fn, useCapture); }
	else { obj.attachEvent( "on" + evType, fn ); }
}





/**
 * easeInOut v1.1 / 2010-06-26
 * 
 * calcule des étapes d'animation douces
 *
 * @param       startValue      {Float}          valeur de départ (peut être inférieure à celle de fin)
 * @param       endValue        {Float}          valeur de fin (peut être supérieure à celle de fin)
 * @param       totalSteps      {Integer}        nombre total d'étapes dans l'animation
 * @param       actualStep      {Integer}        étapes actuelle de l'animation
 * @param       powr            {Float}          "puissance" de la courbe. 1=linéaire et ease-out<1<ease-in. (0.2 et 3 font de belles courbes)
 * @param       round           {Integer}        indique d'arrondir le résultat ou non
 * 
 * @returns     {mixed}         Integer|Float selon la valeur du paramètre round
 * 
 * =============================================================================
 */
function easeInOut( startValue, endValue, totalSteps, actualStep, powr, round ) { 
    var stepp, delta = endValue - startValue; 
    stepp = startValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta); 

    return round ? Math.round(stepp) : stepp;
}





/** 
 * pageDim() 
 * -----------------------------------------------------------------------------
 * retourne les dimentions de la page
 *
 * @return		{Object}		{'w','h'}
 */
function pageDim() {
	var d = document,
		dE = d.documentElement,
		dB = d.body,
		w, h;
		
	// firefox is ok
	h = dE.scrollHeight;
	w = dE.scrollWidth;
	
	// now IE 7 + Opera with "min window"
	if ( dE.clientHeight > h ) { h  = dE.clientHeight; }
	if ( dE.clientWidth > w ) { w  = dE.clientWidth; }
	
	// last for safari
	if ( dB.scrollHeight > h ) { h = dB.scrollHeight; }
	if ( dB.scrollWidth > w ) { w = dB.scrollWidth; }

	return {'w':w, 'h':h} ;
}





/** 
 * winDim v2.0.2, 2010-04-12
 * 
 * retourne les dimentions intérieurs de la fenêtre
 *
 * @returns		{Object}
 * 
 * =============================================================================
 */
function winDim() {
	var W,H,
		i = window,
		d = document,
		de = d.documentElement,
		db = d.body;
		
	if ( i.innerWidth ) { // autres que IE
		W = i.innerWidth;
		H = i.innerHeight;
	} else if ( de.clientWidth ) { // IE8
		W = de.clientWidth;
		H = de.clientHeight;
	}
	else { // IE6
		W = db.clientWidth;
		H = db.clientHeight;
	}

	return {w:W, h:H} ;
}





/**
 * scrolled
 * 
 * retoune les valeurs (horizontale et verticale) de défilement de la fenêtre
 * (en tenant compte du navigateur)
 *
 * @return          Object      {'x','y'}
 * 
 * =============================================================================
 */
function scrolled () {
    var x,y,
		w = window,
		d = document,
		de = d.documentElement,
		db = d.body;
    
    // vrais navigateurs
    if ( w.pageXOffset!==undefined) {
        x = w.pageXOffset;
        y = w.pageYOffset;
    }
    // ie
    else {
        x = de.scrollLeft ? de.scrollLeft : (db.scrollLeft?db.scrollLeft:0) ;
        y = de.scrollTop ? de.scrollTop : (db.scrollTop?db.scrollTop:0) ;
    }
    
    return {'x':x, 'y':y};
}





/** 
 * getPos v1.02
 * 
 * retourne la position (dans la page) de chacun des côtés de l'élément /elem/,
 * dispatché dans un tableau associatif contenant les clés t|b|l|r
 * (la valeur retournée est donnée en pixels)
 * (tient compte des différences de fonctionnement des navigateur)
 *
 * @param           Object          elem            l'élément inspecté
 * 
 * @returns         Integer
 * 
 * =============================================================================
 */
function getPos(elem) {
    var pos={'r':0,'l':0,'t':0,'b':0},
        tmp=elem;
    
    do {
        pos.l += tmp.offsetLeft;
        tmp = tmp.offsetParent;
    } while( tmp !== null );
    pos.r = pos.l + elem.offsetWidth;
    
    tmp=elem;
    do {
        pos.t += tmp.offsetTop;
        tmp = tmp.offsetParent;
    } while( tmp !== null );
    pos.b = pos.t + elem.offsetHeight;
    
    return pos;
}



/** 
 * scroller() v2.2.0, 2010-12-13
 * 
 * défilement doux de la page, notamment pour les liens vers des ancres
 * 
 * =============================================================================
 */
var scroller = {
	
	defOpt: {
		ease: 0.17,					// {Float} effet de décélération
		onStart: 0,					// {Function|undefined} Fonction à éxéctuter au démarrage de l'animation
		onFinish: 0,				// {Function|undefined} Fonction à éxéctuter à la fin de l'animation
		onSrcoll: 0,				// {Function|undefined} Fonction à éxéctuter à chaque étape de l'animation, avec pour paramètre le % courant d'éxécution de l'animation
		duration: function(y,x){		// {Integer|Function} Integer : durée du scroll | Function : calcul d'après la longueur verticale et horizontale du scroll (passées en paramètres)
			// Cette fonction retourne une durée relative à la longeur du scroll.
			// Plus le scroll est grand, plus l'animation dure longtemps.
			// Mais les scroll très longs gardent une durée mesurée.
			y = Math.sqrt( Math.pow( y, 2 ) + Math.pow( x, 2 ) );
			var tmp = 0, i = 0 ;
			while ( tmp < y ) {
				i++ ;
				tmp = tmp + i*i ;
			}
			return i * 50 ;
		},
		rien: 0
	},
	
	/** goTo() 
	 * -------------------------------------------------------------------------
	 * initialise et lance le scrolling
	 *
	 * @param		{HTMLElement}		tgt		l'élément html jusqu'où scroller
	 * @param		{Object}			options		tableau association des options pour l'anim
	 * 
	 * @return		{void}
	 */   
	goTo : function ( tgt, options ) {
		var self = this,				// autoréférence (scroller)
			opera = window.opera,		// permet d'identifier le navigateur Opera
			operaCheat = ' &nbsp; ',	// abbréviation
			tgtPos, initPos,			// raccourcis
			wDim = winDim(),			// mesures de la fenêtre
			pDim = pageDim(),			// mesures de la page
			opt;						// raccourci pour les options
		
		self.opt = transfer( options || {}, self.defOpt );
		opt = self.opt;
		
		self.tgt = tgt;
		initPos = self.initPos = scrolled();
		
		// initialisation du compteur de temps
			self.startTime = new Date().getTime();
			
		// lecture des coordonnées de la destination du scroll
			if ( opera && !tgt.innerHTML ) { tgt.innerHTML = operaCheat; } // opera ne sait pas retourner la position des <a> sans texteNodes
			tgtPos = getPos( tgt );
			if ( opera && tgt.innerHTML != operaCheat ) { tgt.innerHTML = ""; } // pour opera, retour à la normale
			
		// en cas de destination trop proche du bord de la page, redéfinir la position désirée, pour ne pas "buter" contre le bord
			if ( tgtPos.t + wDim.h > pDim.h ) { tgtPos.t = pDim.h - wDim.h; }
			if ( tgtPos.l + wDim.w > pDim.w ) { tgtPos.l = pDim.w - wDim.w; }
			
		// calcul de la durée de l'animation
			if ( typeof opt.duration == "function" ) {
				self.opt.duration = opt.duration.call(
					self,
					tgtPos.t - initPos.y, tgtPos.l - initPos.x // longueur verticale et horizontale du scroll
				) || 1;
			}
		
		// callback de début
			if ( opt.onStart ) { opt.onStart.call( self ); }
		
		// lancer l'animation
			self.tgtPos = tgtPos;
			clearTimeout( self.nextStep );
			self.frame();
	},
	
	
	/** frame() 
	 * -------------------------------------------------------------------------
	 * effectue une étape de l'animation
	 *
	 * @return		{void}
	 */   
	frame : function () {
		
		var self = this,
			t = new Date(), animTime,	// compteurs de temps (ie6 me forcer à déclarer new Date() ici)
			opt,						// raccourci pour les options
			initScroll, tgtPos,			// raccourcis pour des props de scroller
			newX, newY,					// nouvelle position à donner au scroll
			calculTime;					// durée de l'animation, corrigée pour l'easing
			
		opt = self.opt;
		initScroll = self.initPos;
		tgtPos = self.tgtPos;
			
		// calculs du temps écoulé
		t = t.getTime();
		animTime = t - self.startTime;
		calculTime = Math.min( animTime, opt.duration );
        
        // calcul de la nvelle position
		newX = easeInOut( initScroll.x, tgtPos.l, opt.duration, calculTime, opt.ease );
		newY = easeInOut( initScroll.y, tgtPos.t, opt.duration, calculTime, opt.ease );
		
		// déplacer le scrolling de la fenêtre
		window.scrollTo( newX, newY );
		
		// callback optionnelle
		if ( opt.onScroll ) { opt.onScroll.call( self, calculTime / opt.duration ); }

        // si anim terminée
        if ( animTime >= opt.duration || ( newX === tgtPos.l && newY === tgtPos.t ) ) {
			window.location.hash = self.tgt.name; // modifier l'url
			window.scrollTo( tgtPos.l, tgtPos.t );
			if ( opt.onFinish ) { opt.onFinish.call( self ); }
		}
		// sinon lancer le frame suivant
		else {
			clearTimeout(self.nextStep) ;
			self.nextStep = setTimeout ( function(){ self.frame(); }, 1 );
		}
	},

	
	
	/** applyTo() 
	 * -------------------------------------------------------------------------
	 * applique l'effet à tous les liens donnés pointant vers des ancres
	 *
	 * @param			{HTMLElement|Array}		linksList		La liste des liens auxquels appliquer l'effet
	 * @param			{Object}				options			Les options à appliquer aux scrolls
	 *
	 * @return		{void}
	 */   
	applyTo : function ( linksList, options ) {
		
		if ( typeof linksList.length === undefined ) { linksList = [ linksList ]; } // si un seul élément, le placer dans une liste
		
		var self = this,
			link, i, tgtName, noHash,
			tgt,
			nbLinks = linksList.length, loc = window.location, click = "click", // abbréviations
			thisPage = loc.href.replace( loc.hash, "" ); // page actuelle (sans l'ancre)
		
		// pour chaque lien
		for ( i = 0; i < nbLinks; i++ ) { 
			link = linksList[ i ];
			tgtName = link.href.match(/#.+/);
			
			// s'il y a une ancre dans le lien
			if ( tgtName ) {
				tgtName = tgtName[ 0 ].substring( 1 );
				noHash = link.href.replace( link.hash, "" ); // page ciblée (sans l'ancre)
				
				// si l'ancre concerne bien la page actuelle
				if ( noHash == thisPage ) {
					tgt = document.getElementsByName( tgtName )[ 0 ];
					if ( tgt ) {
						addEvent( link, click, newFunc(
							function ( $this, tgt, opt ) { $this.goTo( tgt, opt ); },
							self, tgt, options
						) );
						addEvent( link, click, function(e){ preventDefault(e); } );
					}
				}
			}
		}
	},

	
	
	/** auto() 
	 * -------------------------------------------------------------------------
	 * applique l'effet à tous les liens de la page pointant vers des ancres
	 *
	 * @param		{Object}			options			Les options à appliquer aux scrolls
	 * @return		{void}
	 */   
	auto : function (options) {
		this.applyTo( document.getElementsByTagName( "a" ), options );
	}
};



window.scroller = scroller;
})(window, document);
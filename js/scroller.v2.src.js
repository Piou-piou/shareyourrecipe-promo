/**
 * #############################################################################
 *
 * scroller
 * 
 * d�filement doux de la page, notamment pour les liens vers des ancres
 * 
 * @author      Erwan Lef�vre <erwan.lefevre@gmail.com>
 * @copyright   Erwan Lef�vre 2010
 * @license     Creative Commons - Paternit� 2.0 France
				http://creativecommons.org/licenses/by/2.0/fr/
 * @version     v2.2.0, 2010-12-13
 * @compatibility	v2.2.0 : compatiblit� assur�e avec Firefox 1.5+, IE 5.5+,
 *					Safari, Chrome, Opera.
 * 					Autre versions et navigateurs non test�s
 * 
 * #############################################################################
 */
(function(window, document, undefined){



/**
 * transfer
 * =============================================================================
 * retourne un objet contenant les propri�t�s et m�thodes de l'objet /dest/,
 * compl�t�es et/ou �cras�es par celles de l'objet /source/
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
 * permet d'annuler l'effet normal d'un �v�nement sur un �l�ment html
 * (revient � faire un "return false" pour cet �v�nement, en passant par le event-handeler)
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
 * Cr�e une fonction fn anonyme, qui appellera la fonction /fn/, en lui passant
 * les arguments arg.
 * Sert principalement � cr�er des fonctions en boucle.
 *
 * @param			{Function}		fn						mod�le de fonction � cr�er
 * @param			{Mixed}			arg1, arg2, etc			arguments � passer dans le mod�le
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
 * ajoute la fonction /fn/ � la pile de r�solution de l'�v�nement /evenType/ de
 * l'objet /obj/
 * 
 * merci � : http://www.scottandrew.com/weblog/articles/cbs-events
 *
 * @param		{Mixed}				obj			window, ou document, ou un �l�ment HTML
 * @param		{String}			evType		type d'event (click, mouseover, mouseout, etc.�)
 * @param		{String}			fn			la fonction � ajouter
 * @param		{Boolean}			useCapture	"useCapture un bool�en : true pour la phase de capture, ou false pour la phase de bouillonnement et la cible. On utilise quasiment toujours la valeur false." (cf : http://www.alsacreations.com/article/lire/578-La-gestion-des-evenements-en-JavaScript.html)
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
 * calcule des �tapes d'animation douces
 *
 * @param       startValue      {Float}          valeur de d�part (peut �tre inf�rieure � celle de fin)
 * @param       endValue        {Float}          valeur de fin (peut �tre sup�rieure � celle de fin)
 * @param       totalSteps      {Integer}        nombre total d'�tapes dans l'animation
 * @param       actualStep      {Integer}        �tapes actuelle de l'animation
 * @param       powr            {Float}          "puissance" de la courbe. 1=lin�aire et ease-out<1<ease-in. (0.2 et 3 font de belles courbes)
 * @param       round           {Integer}        indique d'arrondir le r�sultat ou non
 * 
 * @returns     {mixed}         Integer|Float selon la valeur du param�tre round
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
 * retourne les dimentions int�rieurs de la fen�tre
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
 * retoune les valeurs (horizontale et verticale) de d�filement de la fen�tre
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
 * retourne la position (dans la page) de chacun des c�t�s de l'�l�ment /elem/,
 * dispatch� dans un tableau associatif contenant les cl�s t|b|l|r
 * (la valeur retourn�e est donn�e en pixels)
 * (tient compte des diff�rences de fonctionnement des navigateur)
 *
 * @param           Object          elem            l'�l�ment inspect�
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
 * d�filement doux de la page, notamment pour les liens vers des ancres
 * 
 * =============================================================================
 */
var scroller = {
	
	defOpt: {
		ease: 0.17,					// {Float} effet de d�c�l�ration
		onStart: 0,					// {Function|undefined} Fonction � �x�ctuter au d�marrage de l'animation
		onFinish: 0,				// {Function|undefined} Fonction � �x�ctuter � la fin de l'animation
		onSrcoll: 0,				// {Function|undefined} Fonction � �x�ctuter � chaque �tape de l'animation, avec pour param�tre le % courant d'�x�cution de l'animation
		duration: function(y,x){		// {Integer|Function} Integer : dur�e du scroll | Function : calcul d'apr�s la longueur verticale et horizontale du scroll (pass�es en param�tres)
			// Cette fonction retourne une dur�e relative � la longeur du scroll.
			// Plus le scroll est grand, plus l'animation dure longtemps.
			// Mais les scroll tr�s longs gardent une dur�e mesur�e.
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
	 * @param		{HTMLElement}		tgt		l'�l�ment html jusqu'o� scroller
	 * @param		{Object}			options		tableau association des options pour l'anim
	 * 
	 * @return		{void}
	 */   
	goTo : function ( tgt, options ) {
		var self = this,				// autor�f�rence (scroller)
			opera = window.opera,		// permet d'identifier le navigateur Opera
			operaCheat = ' &nbsp; ',	// abbr�viation
			tgtPos, initPos,			// raccourcis
			wDim = winDim(),			// mesures de la fen�tre
			pDim = pageDim(),			// mesures de la page
			opt;						// raccourci pour les options
		
		self.opt = transfer( options || {}, self.defOpt );
		opt = self.opt;
		
		self.tgt = tgt;
		initPos = self.initPos = scrolled();
		
		// initialisation du compteur de temps
			self.startTime = new Date().getTime();
			
		// lecture des coordonn�es de la destination du scroll
			if ( opera && !tgt.innerHTML ) { tgt.innerHTML = operaCheat; } // opera ne sait pas retourner la position des <a> sans texteNodes
			tgtPos = getPos( tgt );
			if ( opera && tgt.innerHTML != operaCheat ) { tgt.innerHTML = ""; } // pour opera, retour � la normale
			
		// en cas de destination trop proche du bord de la page, red�finir la position d�sir�e, pour ne pas "buter" contre le bord
			if ( tgtPos.t + wDim.h > pDim.h ) { tgtPos.t = pDim.h - wDim.h; }
			if ( tgtPos.l + wDim.w > pDim.w ) { tgtPos.l = pDim.w - wDim.w; }
			
		// calcul de la dur�e de l'animation
			if ( typeof opt.duration == "function" ) {
				self.opt.duration = opt.duration.call(
					self,
					tgtPos.t - initPos.y, tgtPos.l - initPos.x // longueur verticale et horizontale du scroll
				) || 1;
			}
		
		// callback de d�but
			if ( opt.onStart ) { opt.onStart.call( self ); }
		
		// lancer l'animation
			self.tgtPos = tgtPos;
			clearTimeout( self.nextStep );
			self.frame();
	},
	
	
	/** frame() 
	 * -------------------------------------------------------------------------
	 * effectue une �tape de l'animation
	 *
	 * @return		{void}
	 */   
	frame : function () {
		
		var self = this,
			t = new Date(), animTime,	// compteurs de temps (ie6 me forcer � d�clarer new Date() ici)
			opt,						// raccourci pour les options
			initScroll, tgtPos,			// raccourcis pour des props de scroller
			newX, newY,					// nouvelle position � donner au scroll
			calculTime;					// dur�e de l'animation, corrig�e pour l'easing
			
		opt = self.opt;
		initScroll = self.initPos;
		tgtPos = self.tgtPos;
			
		// calculs du temps �coul�
		t = t.getTime();
		animTime = t - self.startTime;
		calculTime = Math.min( animTime, opt.duration );
        
        // calcul de la nvelle position
		newX = easeInOut( initScroll.x, tgtPos.l, opt.duration, calculTime, opt.ease );
		newY = easeInOut( initScroll.y, tgtPos.t, opt.duration, calculTime, opt.ease );
		
		// d�placer le scrolling de la fen�tre
		window.scrollTo( newX, newY );
		
		// callback optionnelle
		if ( opt.onScroll ) { opt.onScroll.call( self, calculTime / opt.duration ); }

        // si anim termin�e
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
	 * applique l'effet � tous les liens donn�s pointant vers des ancres
	 *
	 * @param			{HTMLElement|Array}		linksList		La liste des liens auxquels appliquer l'effet
	 * @param			{Object}				options			Les options � appliquer aux scrolls
	 *
	 * @return		{void}
	 */   
	applyTo : function ( linksList, options ) {
		
		if ( typeof linksList.length === undefined ) { linksList = [ linksList ]; } // si un seul �l�ment, le placer dans une liste
		
		var self = this,
			link, i, tgtName, noHash,
			tgt,
			nbLinks = linksList.length, loc = window.location, click = "click", // abbr�viations
			thisPage = loc.href.replace( loc.hash, "" ); // page actuelle (sans l'ancre)
		
		// pour chaque lien
		for ( i = 0; i < nbLinks; i++ ) { 
			link = linksList[ i ];
			tgtName = link.href.match(/#.+/);
			
			// s'il y a une ancre dans le lien
			if ( tgtName ) {
				tgtName = tgtName[ 0 ].substring( 1 );
				noHash = link.href.replace( link.hash, "" ); // page cibl�e (sans l'ancre)
				
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
	 * applique l'effet � tous les liens de la page pointant vers des ancres
	 *
	 * @param		{Object}			options			Les options � appliquer aux scrolls
	 * @return		{void}
	 */   
	auto : function (options) {
		this.applyTo( document.getElementsByTagName( "a" ), options );
	}
};



window.scroller = scroller;
})(window, document);
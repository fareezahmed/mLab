/**
 * jQuery.ScrollTo
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * Works with jQuery +1.2.6. Tested on FF 2/3, IE 6/7/8, Opera 9.5/6, Safari 3, Chrome 1 on WinXP.
 *
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
*		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end. 
 * @param {Number} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @dec Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @ Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */
;(function( $ ){
	
	var $scrollTo = $.scrollTo = function( target, duration, settings ){
		$(window).scrollTo( target, duration, settings );
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function( scope ){
		return $(window)._scrollable();
	};

	// Hack, hack, hack :)
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn._scrollable = function(){
		return this.map(function(){
			var elem = this,
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;

				if ( !isWin )
					return elem;

			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			
			return $.browser.safari || doc.compatMode == 'BackCompat' ?
				doc.body : 
				doc.documentElement;
		});
	};

	$.fn.scrollTo = function( target, duration, settings ){
		if ( typeof duration == 'object' ){
			settings = duration;
			duration = 0;
		}
		if ( typeof settings == 'function' )
			settings = { onAfter:settings };
			
		if ( target == 'max' )
			target = 9e9;
			
		settings = $.extend( {}, $scrollTo.defaults, settings );
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.speed || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;
		
		if ( settings.queue )
			// Let's keep the overall duration
			duration /= 2;
		settings.offset = both( settings.offset );
		settings.over = both( settings.over );

		return this._scrollable().each(function(){
			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch( typeof targ ){
				// A number will pass the regex
				case 'number':
				case 'string':
					if ( /^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ) ){
						targ = both( targ );
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ,this);
				case 'object':
					// DOMElement / jQuery
					if ( targ.is || targ.style )
						// Get the real position of the target 
						toff = (targ = $(targ)).offset();
			}
			$.each( settings.axis.split(''), function( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					max = $scrollTo.max(elem, axis);

				if ( toff ){// jQuery / DOMElement
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

					// If it's a dom element, reduce the margin
					if ( settings.margin ){
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;
					}
					
					attr[key] += settings.offset[pos] || 0;
					
					if ( settings.over[pos] )
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos];
				}else{ 
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) == '%' ? 
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if ( /^\d+$/.test(attr[key]) )
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max );

				// Queueing axes
				if ( !i && settings.queue ){
					// Don't waste time animating, if there's no need.
					if ( old != attr[key] )
						// Intermediate animation
						animate( settings.onAfterFirst );
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});

			animate( settings.onAfter );			

			function animate( callback ){
				$elem.animate( attr, duration, settings.easing, callback && function(){
					callback.call(this, target, settings);
				});
			};

		}).end();
	};
	
	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function( elem, axis ){
		var Dim = axis == 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;
		
		if ( !$(elem).is('html,body') )
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();
		
		var size = 'client' + Dim,
			html = elem.ownerDocument.documentElement,
			body = elem.ownerDocument.body;

		return Math.max( html[scroll], body[scroll] ) 
			 - Math.min( html[size]  , body[size]   );
			
	};

	function both( val ){
		return typeof val == 'object' ? val : { top:val, left:val };
	};

})( jQuery );;
/**
 * jQuery.LocalScroll
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 *
 * @projectDescription Animated scrolling navigation, using anchors.
 * http://flesler.blogspot.com/2007/10/jquerylocalscroll-10.html
 * @author Ariel Flesler
 * @version 1.2.7
 *
 * @id jQuery.fn.localScroll
 * @param {Object} settings Hash of settings, it is passed in to jQuery.ScrollTo, none is required.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @example $('ul.links').localScroll();
 *
 * @example $('ul.links').localScroll({ filter:'.animated', duration:400, axis:'x' });
 *
 * @example $.localScroll({ target:'#pane', axis:'xy', queue:true, event:'mouseover' });
 *
 * Notes:
 *	- The plugin requires jQuery.ScrollTo.
 *	- The hash of settings, is passed to jQuery.ScrollTo, so the settings are valid for that plugin as well.
 *	- jQuery.localScroll can be used if the desired links, are all over the document, it accepts the same settings.
 *  - If the setting 'lazy' is set to true, then the binding will still work for later added anchors.
  *	- If onBefore returns false, the event is ignored.
 **/
;(function( $ ){
	var URI = location.href.replace(/#.*/,''); // local url without hash

	var $localScroll = $.localScroll = function( settings ){
		$('body').localScroll( settings );
	};

	// Many of these defaults, belong to jQuery.ScrollTo, check it's demo for an example of each option.
	// @see http://flesler.demos.com/jquery/scrollTo/
	// The defaults are public and can be overriden.
	$localScroll.defaults = {
		duration:1000, // How long to animate.
		axis:'y', // Which of top and left should be modified.
		event:'click', // On which event to react.
		stop:true, // Avoid queuing animations 
		target: window, // What to scroll (selector or element). The whole window by default.
		reset: true // Used by $.localScroll.hash. If true, elements' scroll is resetted before actual scrolling
		/*
		lock:false, // ignore events if already animating
		lazy:false, // if true, links can be added later, and will still work.
		filter:null, // filter some anchors out of the matched elements.
		hash: false // if true, the hash of the selected link, will appear on the address bar.
		*/
	};

	// If the URL contains a hash, it will scroll to the pointed element
	$localScroll.hash = function( settings ){
		if ( location.hash ){
			settings = $.extend( {}, $localScroll.defaults, settings );
			settings.hash = false; // can't be true
			
			if ( settings.reset ){
				var d = settings.duration;
				delete settings.duration;
				$(settings.target).scrollTo( 0, settings );
				settings.duration = d;
			}
			scroll( 0, location, settings );
		}
	};

	$.fn.localScroll = function( settings ){
		settings = $.extend( {}, $localScroll.defaults, settings );

		return settings.lazy ?
			// use event delegation, more links can be added later.		
			this.bind( settings.event, function( e ){
				// Could use closest(), but that would leave out jQuery -1.3.x
				var a = $([e.target, e.target.parentNode]).filter(filter)[0];
				// if a valid link was clicked
				if ( a )
					scroll( e, a, settings ); // do scroll.
			}) :
			// bind concretely, to each matching link
			this.find('a,area')
				.filter( filter ).bind( settings.event, function(e){
					scroll( e, this, settings );
				}).end()
			.end();

		function filter(){// is this a link that points to an anchor and passes a possible filter ? href is checked to avoid a bug in FF.
			return !!this.href && !!this.hash && this.href.replace(this.hash,'') == URI && (!settings.filter || $(this).is( settings.filter ));
		};
	};

	function scroll( e, link, settings ){
		var id = link.hash.slice(1),
			elem = document.getElementById(id) || document.getElementsByName(id)[0];

		if ( !elem )
			return;

		if ( e )
			e.preventDefault();

		var $target = $( settings.target );

		if ( settings.lock && $target.is(':animated') ||
			settings.onBefore && settings.onBefore.call(settings, e, elem, $target) === false ) 
			return;

		if ( settings.stop )
			$target.stop(true); // remove all its animations

		if ( settings.hash ){
			var attr = elem.id == id ? 'id' : 'name',
				$a = $('<a> </a>').attr(attr, id).css({
					position:'absolute',
					top: $(window).scrollTop(),
					left: $(window).scrollLeft()
				});

			elem[attr] = '';
			$('body').prepend($a);
			location = link.hash;
			$a.remove();
			elem[attr] = id;
		}
			
		$target
			.scrollTo( elem, settings ) // do scroll
			.trigger('notify.serialScroll',[elem]); // notify serialScroll about this change
	};

})( jQuery );;
/*
jQuery Fit Text to Height plugin
Version 0.1
Author: Mike Brant
*/
jQuery.fn.fitToHeight = function(options) {
	options = jQuery.extend({}, jQuery.fn.fitToHeight.defaults, options);
	
	return this.each(function() {
		element = jQuery(this);
		
		// we determine if this is the first time this method has been executed on this element
		if (element.data('initStateSet') == undefined) {
			// read in element's initial state into jQuery data
			var heightInit = element.height();
			element.data('heightInit', heightInit);
			var overflowInit = element.css('overflow');
			element.data('overflowInit', overflowInit);
			var fontSizeInit = parseInt(element.css('font-size').replace('px', ''));
			element.data('fontSizeInit', fontSizeInit);
			var topMarginInit = parseInt(element.css('margin-top').replace('px', ''));
			element.data('topMarginInit', topMarginInit);
			element.data('initStateSet', true);
		} else {
			// reset the element's css to its initial state
			var heightInit = element.data('heightInit');
			element.css('height', heightInit);
			var overflowInit = element.data('overflowInit');
			element.css('overflow', overflowInit);			
			var fontSizeInit = element.data('fontSizeInit');
			element.css('font-size', fontSizeInit+'px');
			var topMarginInit = element.data('topMarginInit');
			element.data('topMarginInit', topMarginInit);
		}

		var maxScrollHeight = options.maxScrollHeight;	
		// if the maxScrollHeight is set to zero, we try to fix text into the CSS-defined height of the element
		if (options.maxScrollHeight == 0) {
			maxScrollHeight = heightInit;
		}
		
		// set overflow to auto. This is needed in order to be able to calculate the scrollHeight correctly (if overflow is set to hidden this will not work). We will set the element overflow back to initial value once resize is complete.
		element.css('overflow', 'auto');

		var scrollHeightInit = element.get(0).scrollHeight;
		var scrollHeight = scrollHeightInit;
		var fontSize = fontSizeInit;
		
		var gIter = 0;
		var gLimit = 100;
		// change text size to fit vertically within the defined maxScrollHeight
		while (scrollHeight > maxScrollHeight) {
		  gIter++;
		  // Prevent an infinite loop
		  if (gIter > gLimit) {
  		  break;
		  }
			fontSize = fontSize - options.fontAdjustIncrement;
			
			if (fontSize == 0) {
			  fontSize = 12;
  			gIter = gLimit;
			}
			
			element.css('font-size', fontSize+'px');
			scrollHeight = element.get(0).scrollHeight;
		}
		
		// if text is to be vertically centered and the text is not set to fit to the initial CSS-defined height, we need to shift the location of the element to make it appear verticaly centered. We do this be modifying the top-margin css property.
		if (options.verticallyCentered == true && options.maxScrollHeight != 0 && scrollHeightInit != scrollHeight) {
			var parentScrollHeight = element.parent().get(0).scrollHeight;
			var centerInit = (parentScrollHeight - heightInit)/2;
			var centerNew = (parentScrollHeight - scrollHeight)/2;
			var topMargin = centerNew - centerInit + topMarginInit;
			element.css('height', scrollHeight+'px');
			element.css('position', 'relative');
			element.css('top', topMargin+'px'); 
		}
		
		// change overflow style back to original state
		element.css('overflow', overflowInit);
	})
}
jQuery.fn.fitToHeight.defaults = {
	verticallyCentered: true,
	maxScrollHeight: 0,
	fontAdjustIncrement: 1
};
/* jQuery Carousel 1.0.0
Copyright 2012 RELEVANT Media Group.
This software is for RELEVANT Media Group use only.
*/
;(function($){
	
    /*function repeat(str, n) {
      return new Array( n + 1 ).join( str );
    }*/
    
    var defaults = {
      'arrows': true,
      'buttons': false
    };
    
    jQuery.fn.carousel = function (settings) {
      
      settings = jQuery.extend( {}, defaults, settings );
      
      var parent = jQuery(this);
      var slider = jQuery(parent).children();
      var items = jQuery(slider).children();
      
      // This makes sliding work.
      parent.css('overflow', 'hidden');
      parent.css('white-space', 'nowrap');
      parent.css('font-size', 0);
      
      // Set inline-block on all items.
      items.each(function() {
        jQuery(this).css('display', 'inline-block');
        jQuery(this).css('vertical-align', 'top');
        jQuery(this).css('white-space', 'normal');
        jQuery(this).css('font-size', '16px');
        jQuery(this).css('min-height', '1px');
      });
      
      var numCloned = visible();
      
      items.filter(':first').before(items.slice(-numCloned).clone().addClass('cloned'));
      items.filter(':last').after(items.slice(0, numCloned).clone().addClass('cloned'));
      
      var newitems = jQuery(slider).children();
      
      // Auxiliary functions
      function resize() {
          
        parent.scrollLeft(w()*numCloned);
        currPage = 1;
      }
      resize();
      jQuery(window).resize(resize);
      
      // Auxiliary functions
      function w() {
        var ret = items.outerWidth(true);
        items.each(function() {
          jQuery(this).attr('data-width', ret);
        });
        return ret;
      }
      function visible() {
        return Math.ceil(parent.outerWidth(true) / w());
      }
      
      var buttons;
      
      // Buttons (dots)
      if (settings.buttons) {
        
        buttons = jQuery('<div class="buttons"></div>');
        
        var i = 0;
        items.each(function() {
          
          i++;
          
          var button = jQuery('<span data-page="' + i + '" class="button">button<span>');
          
          if (i == 1) {
            button.addClass('selected');
          }
          
          button.click(function() {
            
            var page = jQuery(this).data('page');
            gotoPage(page);
          });
          
          buttons.append(button);
        });
        
        parent.after(buttons);
      }
      
      var currPage = 1;
      function gotoPage(page) {
        var offset = (page - currPage);
        var amt = offset*(w());
        
        parent.filter(':not(:animated)').animate({
          scrollLeft : '+=' + amt
        }, 500, function () {
          if (page <= 0) {
            parent.scrollLeft(parent[0].scrollWidth - (w()*(numCloned+1))); // we went back by 1 page, so we account for that.
            page = items.length;
          } else if (page > items.length) {
            parent.scrollLeft(w()*(numCloned)); // we hit the end, so now we want to start at the beginning.
            page = 1;
          }
          
          currPage = page;
          
          if (settings.buttons) {
            buttons.children().removeClass('selected');
            buttons.find('span[data-page="' + currPage + '"]').addClass('selected');
          }
          
          console.log(currPage);
        });
      }
      
      // Arrows
      
      if (settings.arrows) {
        var backArrow = jQuery('<a class="arrow back">&lt;</a>');
        var forwardArrow = jQuery('<a class="arrow forward">&gt;</a>');
        parent.before(backArrow);
        parent.after(forwardArrow);
  
        backArrow.click(function () {
          return gotoPage(currPage - 1);
        });
        
        forwardArrow.css('float', 'left').click(function () {
          return gotoPage(currPage + 1);
        });
      }
      
      // Touch events
      var oldX;
      var moving = false;
      
      if(jQuery(this)[0]) {
        jQuery(this)[0].addEventListener('touchstart', function(event) {
          oldX = event.changedTouches[0].pageX;
          moving = true;
        });
        
        jQuery(this)[0].addEventListener('touchmove', function(event) {
          var delX = (event.changedTouches[0].pageX - oldX);
          
          if (Math.abs(delX) > 20) {
            event.preventDefault();
          }
        });
        
        jQuery(this)[0].addEventListener('touchend', function(event) {
          if (moving) {
            var delX = (event.changedTouches[0].pageX - oldX);
            
            if (delX > 20) {
              gotoPage(currPage - 1);
            }
            else if (delX < -20) {
              gotoPage(currPage + 1);
            }
            event.preventDefault();
          }
          moving = false;
        });
      }
      
    }
	
})(jQuery);;;
/*!
	Colorbox 1.6.3
	license: MIT
	http://www.jacklmoore.com/colorbox
*/
(function ($, document, window) {
	var
	// Default settings object.
	// See http://jacklmoore.com/colorbox for details.
	defaults = {
		// data sources
		html: false,
		photo: false,
		iframe: false,
		inline: false,

		// behavior and appearance
		transition: "elastic",
		speed: 300,
		fadeOut: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		opacity: 0.9,
		preloading: true,
		className: false,
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined,
		closeButton: true,
		fastIframe: true,
		open: false,
		reposition: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,

		// alternate image paths for high-res displays
		retinaImage: false,
		retinaUrl: false,
		retinaSuffix: '@2x.$1',

		// internationalization
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "This content failed to load.",
		imgError: "This image failed to load.",

		// accessbility
		returnFocus: true,
		trapFocus: true,

		// callbacks
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,

		rel: function() {
			return this.rel;
		},
		href: function() {
			// using this.href would give the absolute url, when the href may have been inteded as a selector (e.g. '#container')
			return $(this).attr('href');
		},
		title: function() {
			return this.title;
		},
		createImg: function() {
			var img = new Image();
			var attrs = $(this).data('cbox-img-attrs');

			if (typeof attrs === 'object') {
				$.each(attrs, function(key, val){
					img[key] = val;
				});
			}

			return img;
		},
		createIframe: function() {
			var iframe = document.createElement('iframe');
			var attrs = $(this).data('cbox-iframe-attrs');

			if (typeof attrs === 'object') {
				$.each(attrs, function(key, val){
					iframe[key] = val;
				});
			}

			if ('frameBorder' in iframe) {
				iframe.frameBorder = 0;
			}
			if ('allowTransparency' in iframe) {
				iframe.allowTransparency = "true";
			}
			iframe.name = (new Date()).getTime(); // give the iframe a unique name to prevent caching
			iframe.allowFullscreen = true;

			return iframe;
		}
	},

	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	boxElement = prefix + 'Element',

	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	$events = $('<a/>'), // $({}) would be prefered, but there is an issue with jQuery 1.4.2

	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	index,
	photo,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	requests = 0,
	previousCSS = {},
	init;

	// ****************
	// HELPER FUNCTIONS
	// ****************

	// Convenience function for creating new jQuery objects
	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}

	// Get the window height using innerHeight when available to avoid an issue with iOS
	// http://bugs.jquery.com/ticket/6724
	function winheight() {
		return window.innerHeight ? window.innerHeight : $(window).height();
	}

	function Settings(element, options) {
		if (options !== Object(options)) {
			options = {};
		}

		this.cache = {};
		this.el = element;

		this.value = function(key) {
			var dataAttr;

			if (this.cache[key] === undefined) {
				dataAttr = $(this.el).attr('data-cbox-'+key);

				if (dataAttr !== undefined) {
					this.cache[key] = dataAttr;
				} else if (options[key] !== undefined) {
					this.cache[key] = options[key];
				} else if (defaults[key] !== undefined) {
					this.cache[key] = defaults[key];
				}
			}

			return this.cache[key];
		};

		this.get = function(key) {
			var value = this.value(key);
			return $.isFunction(value) ? value.call(this.el, this) : value;
		};
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var
		max = $related.length,
		newIndex = (index + increment) % max;

		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Convert '%' and 'px' values to integers
	function setSize(size, dimension) {
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
	}

	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by the regex.
	function isImage(settings, url) {
		return settings.get('photo') || settings.get('photoRegex').test(url);
	}

	function retinaUrl(settings, url) {
		return settings.get('retinaUrl') && window.devicePixelRatio > 1 ? url.replace(settings.get('photoRegex'), settings.get('retinaSuffix')) : url;
	}

	function trapFocus(e) {
		if ('contains' in $box[0] && !$box[0].contains(e.target) && e.target !== $overlay[0]) {
			e.stopPropagation();
			$box.focus();
		}
	}

	function setClass(str) {
		if (setClass.str !== str) {
			$box.add($overlay).removeClass(setClass.str).addClass(str);
			setClass.str = str;
		}
	}

	function getRelated(rel) {
		index = 0;

		if (rel && rel !== false && rel !== 'nofollow') {
			$related = $('.' + boxElement).filter(function () {
				var options = $.data(this, colorbox);
				var settings = new Settings(this, options);
				return (settings.get('rel') === rel);
			});
			index = $related.index(settings.el);

			// Check direct calls to Colorbox.
			if (index === -1) {
				$related = $related.add(settings.el);
				index = $related.length - 1;
			}
		} else {
			$related = $(settings.el);
		}
	}

	function trigger(event) {
		// for external use
		$(document).trigger(event);
		// for internal use
		$events.triggerHandler(event);
	}

	var slideshow = (function(){
		var active,
			className = prefix + "Slideshow_",
			click = "click." + prefix,
			timeOut;

		function clear () {
			clearTimeout(timeOut);
		}

		function set() {
			if (settings.get('loop') || $related[index + 1]) {
				clear();
				timeOut = setTimeout(publicMethod.next, settings.get('slideshowSpeed'));
			}
		}

		function start() {
			$slideshow
				.html(settings.get('slideshowStop'))
				.unbind(click)
				.one(click, stop);

			$events
				.bind(event_complete, set)
				.bind(event_load, clear);

			$box.removeClass(className + "off").addClass(className + "on");
		}

		function stop() {
			clear();

			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);

			$slideshow
				.html(settings.get('slideshowStart'))
				.unbind(click)
				.one(click, function () {
					publicMethod.next();
					start();
				});

			$box.removeClass(className + "on").addClass(className + "off");
		}

		function reset() {
			active = false;
			$slideshow.hide();
			clear();
			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);
			$box.removeClass(className + "off " + className + "on");
		}

		return function(){
			if (active) {
				if (!settings.get('slideshow')) {
					$events.unbind(event_cleanup, reset);
					reset();
				}
			} else {
				if (settings.get('slideshow') && $related[1]) {
					active = true;
					$events.one(event_cleanup, reset);
					if (settings.get('slideshowAuto')) {
						start();
					} else {
						stop();
					}
					$slideshow.show();
				}
			}
		};

	}());


	function launch(element) {
		var options;

		if (!closing) {

			options = $(element).data(colorbox);

			settings = new Settings(element, options);

			getRelated(settings.get('rel'));

			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.

				setClass(settings.get('className'));

				// Show colorbox so the sizes can be calculated in older versions of jQuery
				$box.css({visibility:'hidden', display:'block', opacity:''});

				$loaded = $tag(div, 'LoadedContent', 'width:0; height:0; overflow:hidden; visibility:hidden');
				$content.css({width:'', height:''}).append($loaded);

				// Cache values needed for size calculations
				interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();
				interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
				loadedHeight = $loaded.outerHeight(true);
				loadedWidth = $loaded.outerWidth(true);

				// Opens inital empty Colorbox prior to content being loaded.
				var initialWidth = setSize(settings.get('initialWidth'), 'x');
				var initialHeight = setSize(settings.get('initialHeight'), 'y');
				var maxWidth = settings.get('maxWidth');
				var maxHeight = settings.get('maxHeight');

				settings.w = Math.max((maxWidth !== false ? Math.min(initialWidth, setSize(maxWidth, 'x')) : initialWidth) - loadedWidth - interfaceWidth, 0);
				settings.h = Math.max((maxHeight !== false ? Math.min(initialHeight, setSize(maxHeight, 'y')) : initialHeight) - loadedHeight - interfaceHeight, 0);

				$loaded.css({width:'', height:settings.h});
				publicMethod.position();

				trigger(event_open);
				settings.get('onOpen');

				$groupControls.add($title).hide();

				$box.focus();

				if (settings.get('trapFocus')) {
					// Confine focus to the modal
					// Uses event capturing that is not supported in IE8-
					if (document.addEventListener) {

						document.addEventListener('focus', trapFocus, true);

						$events.one(event_closed, function () {
							document.removeEventListener('focus', trapFocus, true);
						});
					}
				}

				// Return focus on closing
				if (settings.get('returnFocus')) {
					$events.one(event_closed, function () {
						$(settings.el).focus();
					});
				}
			}

			var opacity = parseFloat(settings.get('opacity'));
			$overlay.css({
				opacity: opacity === opacity ? opacity : '',
				cursor: settings.get('overlayClose') ? 'pointer' : '',
				visibility: 'visible'
			}).show();

			if (settings.get('closeButton')) {
				$close.html(settings.get('close')).appendTo($content);
			} else {
				$close.appendTo('<div/>'); // replace with .detach() when dropping jQuery < 1.4
			}

			load();
		}
	}

	// Colorbox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box) {
			init = false;
			$window = $(window);
			$box = $tag(div).attr({
				id: colorbox,
				'class': $.support.opacity === false ? prefix + 'IE' : '', // class for optional IE8 & lower targeted CSS.
				role: 'dialog',
				tabindex: '-1'
			}).hide();
			$overlay = $tag(div, "Overlay").hide();
			$loadingOverlay = $([$tag(div, "LoadingOverlay")[0],$tag(div, "LoadingGraphic")[0]]);
			$wrap = $tag(div, "Wrapper");
			$content = $tag(div, "Content").append(
				$title = $tag(div, "Title"),
				$current = $tag(div, "Current"),
				$prev = $('<button type="button"/>').attr({id:prefix+'Previous'}),
				$next = $('<button type="button"/>').attr({id:prefix+'Next'}),
				$slideshow = $tag('button', "Slideshow"),
				$loadingOverlay
			);

			$close = $('<button type="button"/>').attr({id:prefix+'Close'});

			$wrap.append( // The 3x3 Grid that makes up Colorbox
				$tag(div).append(
					$tag(div, "TopLeft"),
					$topBorder = $tag(div, "TopCenter"),
					$tag(div, "TopRight")
				),
				$tag(div, false, 'clear:left').append(
					$leftBorder = $tag(div, "MiddleLeft"),
					$content,
					$rightBorder = $tag(div, "MiddleRight")
				),
				$tag(div, false, 'clear:left').append(
					$tag(div, "BottomLeft"),
					$bottomBorder = $tag(div, "BottomCenter"),
					$tag(div, "BottomRight")
				)
			).find('div div').css({'float': 'left'});

			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;');

			$groupControls = $next.add($prev).add($current).add($slideshow);
		}
		if (document.body && !$box.parent().length) {
			$(document.body).append($overlay, $box.append($wrap, $loadingBay));
		}
	}

	// Add Colorbox's event bindings
	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				launch(this);
			}
		}

		if ($box) {
			if (!init) {
				init = true;

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.get('overlayClose')) {
						publicMethod.close();
					}
				});

				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.get('escKey') && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (open && settings.get('arrowKey') && $related[1] && !e.altKey) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});

				if ($.isFunction($.fn.on)) {
					// For jQuery 1.7+
					$(document).on('click.'+prefix, '.'+boxElement, clickHandler);
				} else {
					// For jQuery 1.3.x -> 1.6.x
					// This code is never reached in jQuery 1.9, so do not contact me about 'live' being removed.
					// This is not here for jQuery 1.9, it's here for legacy users.
					$('.'+boxElement).live('click.'+prefix, clickHandler);
				}
			}
			return true;
		}
		return false;
	}

	// Don't do anything if Colorbox already exists.
	if ($[colorbox]) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.colorbox.close();
	// Usage from within an iframe: parent.jQuery.colorbox.close();
	// ****************

	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var settings;
		var $obj = this;

		options = options || {};

		if ($.isFunction($obj)) { // assume a call to $.colorbox
			$obj = $('<a/>');
			options.open = true;
		}

		if (!$obj[0]) { // colorbox being applied to empty collection
			return $obj;
		}

		appendHTML();

		if (addBindings()) {

			if (callback) {
				options.onComplete = callback;
			}

			$obj.each(function () {
				var old = $.data(this, colorbox) || {};
				$.data(this, colorbox, $.extend(old, options));
			}).addClass(boxElement);

			settings = new Settings($obj[0], options);

			if (settings.get('open')) {
				launch($obj[0]);
			}
		}

		return $obj;
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		css,
		top = 0,
		left = 0,
		offset = $box.offset(),
		scrollTop,
		scrollLeft;

		$window.unbind('resize.' + prefix);

		// remove the modal so that it doesn't influence the document width/height
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.get('fixed')) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}

		// keeps the top and left positions within the browser's viewport.
		if (settings.get('right') !== false) {
			left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.get('right'), 'x'), 0);
		} else if (settings.get('left') !== false) {
			left += setSize(settings.get('left'), 'x');
		} else {
			left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
		}

		if (settings.get('bottom') !== false) {
			top += Math.max(winheight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.get('bottom'), 'y'), 0);
		} else if (settings.get('top') !== false) {
			top += setSize(settings.get('top'), 'y');
		} else {
			top += Math.round(Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
		}

		$box.css({top: offset.top, left: offset.left, visibility:'visible'});

		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";

		function modalDimensions() {
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = (parseInt($box[0].style.width,10) - interfaceWidth)+'px';
			$content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = (parseInt($box[0].style.height,10) - interfaceHeight)+'px';
		}

		css = {width: settings.w + loadedWidth + interfaceWidth, height: settings.h + loadedHeight + interfaceHeight, top: top, left: left};

		// setting the speed to 0 if the content hasn't changed size or position
		if (speed) {
			var tempSpeed = 0;
			$.each(css, function(i){
				if (css[i] !== previousCSS[i]) {
					tempSpeed = speed;
					return;
				}
			});
			speed = tempSpeed;
		}

		previousCSS = css;

		if (!speed) {
			$box.css(css);
		}

		$box.dequeue().animate(css, {
			duration: speed || 0,
			complete: function () {
				modalDimensions();

				active = false;

				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";

				if (settings.get('reposition')) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}

				if ($.isFunction(loadedCallback)) {
					loadedCallback();
				}
			},
			step: modalDimensions
		});
	};

	publicMethod.resize = function (options) {
		var scrolltop;

		if (open) {
			options = options || {};

			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}

			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}

			$loaded.css({width: settings.w});

			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}

			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}

			if (!options.innerHeight && !options.height) {
				scrolltop = $loaded.scrollTop();
				$loaded.css({height: "auto"});
				settings.h = $loaded.height();
			}

			$loaded.css({height: settings.h});

			if(scrolltop) {
				$loaded.scrollTop(scrolltop);
			}

			publicMethod.position(settings.get('transition') === "none" ? 0 : settings.get('speed'));
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}

		var callback, speed = settings.get('transition') === "none" ? 0 : settings.get('speed');

		$loaded.remove();

		$loaded = $tag(div, 'LoadedContent').append(object);

		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}

		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.get('scrolling') ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);

		$loadingBay.hide();

		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.

		$(photo).css({'float': 'none'});

		setClass(settings.get('className'));

		callback = function () {
			var total = $related.length,
				iframe,
				complete;

			if (!open) {
				return;
			}

			function removeFilter() { // Needed for IE8 in versions of jQuery prior to 1.7.2
				if ($.support.opacity === false) {
					$box[0].style.removeAttribute('filter');
				}
			}

			complete = function () {
				clearTimeout(loadingTimer);
				$loadingOverlay.hide();
				trigger(event_complete);
				settings.get('onComplete');
			};


			$title.html(settings.get('title')).show();
			$loaded.show();

			if (total > 1) { // handle grouping
				if (typeof settings.get('current') === "string") {
					$current.html(settings.get('current').replace('{current}', index + 1).replace('{total}', total)).show();
				}

				$next[(settings.get('loop') || index < total - 1) ? "show" : "hide"]().html(settings.get('next'));
				$prev[(settings.get('loop') || index) ? "show" : "hide"]().html(settings.get('previous'));

				slideshow();

				// Preloads images within a rel group
				if (settings.get('preloading')) {
					$.each([getIndex(-1), getIndex(1)], function(){
						var img,
							i = $related[this],
							settings = new Settings(i, $.data(i, colorbox)),
							src = settings.get('href');

						if (src && isImage(settings, src)) {
							src = retinaUrl(settings, src);
							img = document.createElement('img');
							img.src = src;
						}
					});
				}
			} else {
				$groupControls.hide();
			}

			if (settings.get('iframe')) {

				iframe = settings.get('createIframe');

				if (!settings.get('scrolling')) {
					iframe.scrolling = "no";
				}

				$(iframe)
					.attr({
						src: settings.get('href'),
						'class': prefix + 'Iframe'
					})
					.one('load', complete)
					.appendTo($loaded);

				$events.one(event_purge, function () {
					iframe.src = "//about:blank";
				});

				if (settings.get('fastIframe')) {
					$(iframe).trigger('load');
				}
			} else {
				complete();
			}

			if (settings.get('transition') === 'fade') {
				$box.fadeTo(speed, 1, removeFilter);
			} else {
				removeFilter();
			}
		};

		if (settings.get('transition') === 'fade') {
			$box.fadeTo(speed, 0, function () {
				publicMethod.position(0, callback);
			});
		} else {
			publicMethod.position(speed, callback);
		}
	};

	function load () {
		var href, setResize, prep = publicMethod.prep, $inline, request = ++requests;

		active = true;

		photo = false;

		trigger(event_purge);
		trigger(event_load);
		settings.get('onLoad');

		settings.h = settings.get('height') ?
				setSize(settings.get('height'), 'y') - loadedHeight - interfaceHeight :
				settings.get('innerHeight') && setSize(settings.get('innerHeight'), 'y');

		settings.w = settings.get('width') ?
				setSize(settings.get('width'), 'x') - loadedWidth - interfaceWidth :
				settings.get('innerWidth') && setSize(settings.get('innerWidth'), 'x');

		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;

		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.get('maxWidth')) {
			settings.mw = setSize(settings.get('maxWidth'), 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.get('maxHeight')) {
			settings.mh = setSize(settings.get('maxHeight'), 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}

		href = settings.get('href');

		loadingTimer = setTimeout(function () {
			$loadingOverlay.show();
		}, 100);

		if (settings.get('inline')) {
			var $target = $(href);
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when Colorbox closes or loads new content.
			$inline = $('<div>').hide().insertBefore($target);

			$events.one(event_purge, function () {
				$inline.replaceWith($target);
			});

			prep($target);
		} else if (settings.get('iframe')) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.get('html')) {
			prep(settings.get('html'));
		} else if (isImage(settings, href)) {

			href = retinaUrl(settings, href);

			photo = settings.get('createImg');

			$(photo)
			.addClass(prefix + 'Photo')
			.bind('error.'+prefix,function () {
				prep($tag(div, 'Error').html(settings.get('imgError')));
			})
			.one('load', function () {
				if (request !== requests) {
					return;
				}

				// A small pause because some browsers will occassionaly report a
				// img.width and img.height of zero immediately after the img.onload fires
				setTimeout(function(){
					var percent;

					if (settings.get('retinaImage') && window.devicePixelRatio > 1) {
						photo.height = photo.height / window.devicePixelRatio;
						photo.width = photo.width / window.devicePixelRatio;
					}

					if (settings.get('scalePhotos')) {
						setResize = function () {
							photo.height -= photo.height * percent;
							photo.width -= photo.width * percent;
						};
						if (settings.mw && photo.width > settings.mw) {
							percent = (photo.width - settings.mw) / photo.width;
							setResize();
						}
						if (settings.mh && photo.height > settings.mh) {
							percent = (photo.height - settings.mh) / photo.height;
							setResize();
						}
					}

					if (settings.h) {
						photo.style.marginTop = Math.max(settings.mh - photo.height, 0) / 2 + 'px';
					}

					if ($related[1] && (settings.get('loop') || $related[index + 1])) {
						photo.style.cursor = 'pointer';

						$(photo).bind('click.'+prefix, function () {
							publicMethod.next();
						});
					}

					photo.style.width = photo.width + 'px';
					photo.style.height = photo.height + 'px';
					prep(photo);
				}, 1);
			});

			photo.src = href;

		} else if (href) {
			$loadingBay.load(href, settings.get('data'), function (data, status) {
				if (request === requests) {
					prep(status === 'error' ? $tag(div, 'Error').html(settings.get('xhrError')) : $(this).contents());
				}
			});
		}
	}

	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (settings.get('loop') || $related[index + 1])) {
			index = getIndex(1);
			launch($related[index]);
		}
	};

	publicMethod.prev = function () {
		if (!active && $related[1] && (settings.get('loop') || index)) {
			index = getIndex(-1);
			launch($related[index]);
		}
	};

	// Note: to use this within an iframe use the following format: parent.jQuery.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {

			closing = true;
			open = false;
			trigger(event_cleanup);
			settings.get('onCleanup');
			$window.unbind('.' + prefix);
			$overlay.fadeTo(settings.get('fadeOut') || 0, 0);

			$box.stop().fadeTo(settings.get('fadeOut') || 0, 0, function () {
				$box.hide();
				$overlay.hide();
				trigger(event_purge);
				$loaded.remove();

				setTimeout(function () {
					closing = false;
					trigger(event_closed);
					settings.get('onClosed');
				}, 1);
			});
		}
	};

	// Removes changes Colorbox made to the document, but does not remove the plugin.
	publicMethod.remove = function () {
		if (!$box) { return; }

		$box.stop();
		$[colorbox].close();
		$box.stop(false, true).remove();
		$overlay.remove();
		closing = false;
		$box = null;
		$('.' + boxElement)
			.removeData(colorbox)
			.removeClass(boxElement);

		$(document).unbind('click.'+prefix).unbind('keydown.'+prefix);
	};

	// A method for fetching the current element Colorbox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(settings.el);
	};

	publicMethod.settings = defaults;

}(jQuery, document, window));
;
/*1.1.0*/var Mailcheck={domainThreshold:4,topLevelThreshold:3,defaultDomains:"yahoo.com google.com hotmail.com gmail.com me.com aol.com mac.com live.com comcast.net googlemail.com msn.com hotmail.co.uk yahoo.co.uk facebook.com verizon.net sbcglobal.net att.net gmx.com mail.com outlook.com icloud.com".split(" "),defaultTopLevelDomains:"co.jp co.uk com net org info edu gov mil ca".split(" "),run:function(a){a.domains=a.domains||Mailcheck.defaultDomains;a.topLevelDomains=a.topLevelDomains||Mailcheck.defaultTopLevelDomains;
a.distanceFunction=a.distanceFunction||Mailcheck.sift3Distance;var b=function(a){return a},c=a.suggested||b,b=a.empty||b;return(a=Mailcheck.suggest(Mailcheck.encodeEmail(a.email),a.domains,a.topLevelDomains,a.distanceFunction))?c(a):b()},suggest:function(a,b,c,d){a=a.toLowerCase();a=this.splitEmail(a);if(b=this.findClosestDomain(a.domain,b,d,this.domainThreshold)){if(b!=a.domain)return{address:a.address,domain:b,full:a.address+"@"+b}}else if(c=this.findClosestDomain(a.topLevelDomain,c,d,this.topLevelThreshold),
a.domain&&c&&c!=a.topLevelDomain)return d=a.domain,b=d.substring(0,d.lastIndexOf(a.topLevelDomain))+c,{address:a.address,domain:b,full:a.address+"@"+b};return!1},findClosestDomain:function(a,b,c,d){d=d||this.topLevelThreshold;var e,g=99,f=null;if(!a||!b)return!1;c||(c=this.sift3Distance);for(var h=0;h<b.length;h++){if(a===b[h])return a;e=c(a,b[h]);e<g&&(g=e,f=b[h])}return g<=d&&null!==f?f:!1},sift3Distance:function(a,b){if(null==a||0===a.length)return null==b||0===b.length?0:b.length;if(null==b||
0===b.length)return a.length;for(var c=0,d=0,e=0,g=0;c+d<a.length&&c+e<b.length;){if(a.charAt(c+d)==b.charAt(c+e))g++;else for(var f=e=d=0;5>f;f++){if(c+f<a.length&&a.charAt(c+f)==b.charAt(c)){d=f;break}if(c+f<b.length&&a.charAt(c)==b.charAt(c+f)){e=f;break}}c++}return(a.length+b.length)/2-g},splitEmail:function(a){a=a.trim().split("@");if(2>a.length)return!1;for(var b=0;b<a.length;b++)if(""===a[b])return!1;var c=a.pop(),d=c.split("."),e="";if(0==d.length)return!1;if(1==d.length)e=d[0];else{for(b=
1;b<d.length;b++)e+=d[b]+".";2<=d.length&&(e=e.substring(0,e.length-1))}return{topLevelDomain:e,domain:c,address:a.join("@")}},encodeEmail:function(a){a=encodeURI(a);return a=a.replace("%20"," ").replace("%25","%").replace("%5E","^").replace("%60","`").replace("%7B","{").replace("%7C","|").replace("%7D","}")}};"undefined"!==typeof module&&module.exports&&(module.exports=Mailcheck);
"undefined"!==typeof window&&window.jQuery&&function(a){a.fn.mailcheck=function(a){var c=this;if(a.suggested){var d=a.suggested;a.suggested=function(a){d(c,a)}}if(a.empty){var e=a.empty;a.empty=function(){e.call(null,c)}}a.email=this.val();Mailcheck.run(a)}}(jQuery);
;
Drupal.behaviors.relevant = { 
  attach: function(context, settings) {
    
    jQuery(window).resize(function() {
      jQuery.colorbox.resize({width: jQuery('#cboxLoadedContent > *').outerWidth()});
    });
    
    if (jQuery('.lightbox').length > 0) {
      jQuery('.restricted').colorbox({opacity: 0.75, inline:true, href:".paywall.intro", scrolling: false});
    }
    
    jQuery('.field-name-field-content-image .html a').colorbox({opacity: 0.75, scrolling: false});
    
    jQuery.fn.relevantSlide = function() {      
      
      jQuery(this).addClass('animating');
      jQuery(this).animate({
        opacity: 'toggle',
        height: 'toggle'
      }, 'slow', function() {
        jQuery(this).removeClass('animating');
      });
    };
  
    jQuery.fn.relevantSlideOut = function() {
      
      jQuery(this).addClass('animating');
      jQuery(this).animate({
        opacity: 'hide',
        height: 'hide'
      }, 'slow', function() {
        jQuery(this).removeClass('animating');
      });
    };
    
    jQuery.fn.relevantSlideIn = function() {
      jQuery(this).addClass('animating');
      jQuery(this).animate({
        opacity: 'show',
        height: 'show'
      }, 'slow', function() {
        jQuery(this).removeClass('animating');
      });
    };
    
    // Detect Touch
    var touch = false;
    if (typeof(window.ontouchstart) != 'undefined') {
      touch = true;
      jQuery('body').removeClass('no-touch');
    }
    
    jQuery('.form-type-password .field-prefix .show-hide-link').once('move-password', function(){
      var href = jQuery(this).attr('href');
      href = href.split('#');
      var id = href[1];
      var newid = id + '-moved';
      jQuery(this).parent().parent().after('<div id="' + newid + '" class="forgot-password-form"></div>');
      jQuery(this).attr('href', '#' + newid);
      jQuery('#' + id +':not(.js-hidden)').hide().addClass('js-hidden');
      jQuery('#' + id + ' input').each(function() {
        var inputid = jQuery(this).attr('id');
        var element = document.getElementById(inputid);
        if (element) {
          element.setAttribute('form', id);
        }
      });
      var formitem = jQuery('#' + id + ' .form-item').html();
      jQuery('#' + id + ' .form-item').html('');
      jQuery('#' + newid).append(formitem);
      var formactions = jQuery('#' + id + ' .form-actions').html();
      jQuery('#' + id + ' .form-actions').html('');
      jQuery('#' + newid).append(formactions);
    });
    
    jQuery('.show-password').toggle(function() {
  	  id = jQuery(this).parent().next('input').attr('id');
  		document.getElementById(id).type = 'text';
  		jQuery(this).html('Hide Password');
  	}, function() {
  	 id = jQuery(this).parent().next('input').attr('id');
  	 document.getElementById(id).type = 'password';
  	 jQuery(this).html('Show Password');
  	});

    // Open External Links not on RMG domains in a new window  //
  	// Get all the external links and set them to open in a new window
  	jQuery('a[href^="http://"], a[href^="https://"], a[href^="//"]').attr('target', '_blank');
  	// Then undo the RMG ones
  	var rmgurl = Array('relevantmediagroup.com', 'relevantmagazine.com', 'rejectapathy.com', 'rejectapathy.org', 'neuemagazine.com', 'relevantstore.com', 'relevantyouth.com', 'releradio.com', 'relevant.fm', 'relevant.tv', 'relm.ag', 'ram.ag', 'localhost');
  	for (i=0; i<= rmgurl.length; i++) {
    	jQuery('a[href*="' + rmgurl[i] + '"]').not('.stumbleupon a').attr("target", "");
  	}
  	
  	// Open links with the class "new-window" in a new window
  	jQuery('a.new-window').attr('target','blank');
  	
  	// Remove the Recover Password form
  	jQuery('a.show-link, a.show-hide-link').each(function(index,element) {
  	 var hide = jQuery(this).attr('href');
  	 if (!jQuery(hide+' input').hasClass('error')) {
  	   jQuery(hide+':not(.js-hidden)').hide().addClass('js-hidden');
  	 }
  	});
  	
  	// Disable autocomplete on honeypot fields
  	jQuery('input[name="hpvalidate"]').attr('autocomplete','off');
  	
  	// Temporarily add in "buttons" to the homepage promo carousel.
  	//jQuery('<div id="homepage-carousel-left-button" class="homepage-carousel-button">&lt;</div>').prependTo('.bean-bag-home-promo .field-items');
  	//jQuery('<div id="homepage-carousel-right-button" class="homepage-carousel-button">&gt;</div>').appendTo('.bean-bag-home-promo .field-items');
  	
  	jQuery('a.show-link').once().click(function(event) {
  	 var show = jQuery(this).attr('href');
  	 jQuery(show).relevantSlideIn();
  	 event.preventDefault();
  	});
  	
  	jQuery('a.hide-link').once().click(function(event) {
  	 var show = jQuery(this).attr('href');
  	 jQuery(show).relevantSlideOut();
  	 event.preventDefault();
  	});
  	
  	jQuery('a.show-hide-link').once().click(function(event) {
  	 var show = jQuery(this).attr('href');
  	 if (jQuery(this).hasClass('open')) {
    	 jQuery(show).relevantSlideOut();
    	 jQuery(this).removeClass('open').addClass('closed');
  	 }
  	 else {
    	 jQuery(show).relevantSlideIn();
    	 jQuery(this).removeClass('closed').addClass('open');
    	 if (jQuery(this).hasClass('login')) {
      	jQuery(this).parent().children('.register.open').click(); 
    	 }
    	 else if (jQuery(this).hasClass('register')) {
      	jQuery(this).parent().children('.login.open').click(); 
    	 }
  	 }
  	 event.preventDefault();
  	});
  	
  	jQuery('.block-user-login-register a.login, .block-user-login-register a.register').once().click(function(event) {
  	   event.preventDefault();
       if (jQuery(this).hasClass('login')) {
        var show = jQuery(this).parent().children('.login-register.login');
      	jQuery(this).parent().children('.register.open').click(); 
    	 }
    	 else if (jQuery(this).hasClass('register')) {
    	  var show = jQuery(this).parent().children('.login-register.register');
      	jQuery(this).parent().children('.login.open').click(); 
    	 }
    	 if (jQuery(this).hasClass('open')) {
      	 jQuery(show).relevantSlideOut();
      	 jQuery(this).removeClass('open').addClass('closed');
    	 }
    	 else {
      	 jQuery(show).relevantSlideIn();
      	 jQuery(this).removeClass('closed').addClass('open');
    	 }
  	});
  	
  	jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-embed .media.embed .thumbnail a').once().click(function(event) {
  	 event.preventDefault();
  	 var thumbnaillink = jQuery(this);
  	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-cover').animate({marginTop: '500px'}, 'slow');
  	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-tablet-cover').animate({marginTop: '500px'}, 'slow');
  	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-embed + .item-list').animate({marginTop: '283px'}, 'slow');
  	 thumbnaillink.css('opacity', '0');
  	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-embed .media.embed .html').animate({opacity: 'show', height: 'show'}, 'slow', 'swing', function() {
    	 jQuery.each(settings.embed.field_embed, function() {
      	 var newhtml = this.html;
      	 var id = '#' + this.id + ' .html';
      	 jQuery(id).html(newhtml);
    	 });
    	 jQuery('<a class="closeembed">Close</a>').appendTo('.vocabulary-type-issue .term-listing-heading .field-name-field-embed .media.embed .html').css('display', 'none').click(function(event) {
      	 event.preventDefault();
      	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-cover').animate({marginTop: '0'}, 'slow');
      	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-tablet-cover').animate({marginTop: '0'}, 'slow');
      	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-embed + .item-list').animate({marginTop: '0'}, 'slow');
      	 jQuery('.vocabulary-type-issue .term-listing-heading .field-name-field-embed .media.embed .html').animate({opacity: 'hide', height: 'hide'}, 'slow', 'swing', function() {
      	   jQuery(this).children('iframe').css('display', 'none');
      	   jQuery(this).css('display', 'none').empty();
      	   thumbnaillink.animate({opacity: '1'}, 'fast');
      	 });
    	 });
    	 jQuery('.closeembed').fadeIn('fast');
  	 });
  	});
  	
  	
  	// Preview Tracks Show More
  	
  	if (jQuery('body').hasClass('page-user')) {
    	jQuery('.field-name-field-preview-tracks').once().css('display','none');
    	jQuery('.field-name-field-preview-tracks').once(function() {
    	 var thiselement = jQuery(this);
    	 var showmore = jQuery('<a href="#" class="album-showmore">Preview Album Tracks</a>');
    	 showmore.insertBefore(thiselement);
    	 showmore.once().click(function(event) {
    	   thiselement.relevantSlideIn();
    	   showmore.relevantSlideOut();
    	   event.preventDefault();
    	 });
    	});
  	}
  	else {
    	/*jQuery('.field-name-field-preview-tracks .field-items .field-item').once().css('display','none');
    	jQuery('.field-name-field-preview-tracks .field-items').once(function() {
    	 var thiselement = jQuery(this);
    	 thiselement.children('.field-item:lt(5)').css('display','block');
    	 var showmore = jQuery('<a href="#" class="album-showmore">Show All Tracks</a>');
    	 if (thiselement.children('.field-item').length > 5 ) {
    	   showmore.appendTo(thiselement);
    	 }
    	 showmore.once().click(function(event) {
    	   thiselement.children('.field-item:gt(4)').relevantSlideIn();
    	   showmore.relevantSlideOut();
    	   event.preventDefault();
    	 });
    	});*/
    }
  	
  	jQuery(window).load(function() {
      // Fix the menu bar at the top of the window on scroll
    	if (jQuery('#menu-outer-wrap').length > 0) {
        var menutop = jQuery('#menu-outer-wrap').offset().top;
        
        function changeFixed() {
          var current = jQuery(this).scrollTop();
          if (current >= menutop) {
            jQuery('#menu-outer-wrap').addClass('fixed');
          } else {
            jQuery('#menu-outer-wrap').removeClass('fixed');
          }
        }
        
        //First load set fixed or not.
        changeFixed();
        
        jQuery(window).scroll(changeFixed);
    	}
    	
    });
    
    jQuery('.fit-height').once('fit-height', function() {
      jQuery(this).fitToHeight();
    });
    
    jQuery('form.user-login, form.user-register-form').once('disabled').submit(function(event) {
      id = jQuery(this).attr('id');
      jQuery('#' + id + ' .form-submit').attr('disabled', 'disabled');
    });
    
    // Forum Times
    jQuery('.node-forum.view-mode-full .node-inner-content time').once('local').each(function() {
      var months = new Array(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'Septempter',
        'October',
        'November',
        'December'
      );
      var timestamp = jQuery(this).attr('datetime');
      var date = new Date(timestamp);
      if (date) {
        var local = new Date(date.toLocaleString());
        var month = local.getMonth();
        var hours = local.getHours();
        var meridian = '';
        if (hours >= 12) {
          meridian = 'PM';
          hours = hours - 12;
        }
        else {
          meridian = 'AM';
        }
        if (hours == 0) {
          hours = 12;
        }
        var minutes = local.getMinutes();
        minutes = (minutes < 10) ? '0'+minutes : minutes;
        var string = months[month]+' '+local.getDate()+', '+local.getFullYear()+' AT '+hours+':'+minutes+' '+meridian;
        
        if (hours) {
          jQuery(this).html(string);
        }
      }
    });
    
    // Comment Times
    jQuery('.comment time, .node-forum.view-mode-teaser .node-inner-content time').once('local').each(function() {
      var timestamp = jQuery(this).attr('datetime');
      var date = new Date(timestamp);
      if (date) {
        var local = new Date(date.toLocaleString());
        var month = local.getMonth();
        month++;
        var hours = local.getHours();
        var meridian = '';
        if (hours >= 12) {
          meridian = 'PM';
          hours = hours - 12;
        }
        else {
          meridian = 'AM';
        }
        if (hours == 0) {
          hours = 12;
        }
        var minutes = local.getMinutes();
        minutes = (minutes < 10) ? '0'+minutes : minutes;
        var string = month+'/'+local.getDate()+'/'+local.getFullYear()+' '+hours+':'+minutes+' '+meridian;
        
        if (hours) {
          jQuery(this).html(string);
        }
      }
    });
    
    var $wrapper = jQuery('#feature-image .magcarousel');

    $slider = $wrapper.children();
    $items = $slider.children();
    
    if ($items.length > 1) {
      $wrapper.once().carousel();
    }
    
    jQuery('input.required').once('required').blur(function() {
      if (!jQuery(this).val()) {
        jQuery(this).addClass('empty');
      }
      else {
        jQuery(this).removeClass('empty');
      }
    });
  	
  },  
};

jQuery.fn.codeAction = function(code, action) {
  
  var curr = 0;
  
  jQuery(this).keydown(function(event) {
    if (event.keyCode == code[curr]) {
      curr++;
    }
    else {
      curr = 0;
      return;
    }
    if (curr == 10) {
      action();
      curr = 0;
    }
  });
  
  return this;
};

// Konami Code
jQuery('body').codeAction([38,38,40,40,37,39,37,39,66,65], function() {
  jQuery('body').toggleClass('youspinmerightround');
});

jQuery('body').codeAction([38,38,40,40,37,39,37,39,66,70], function() {
  var KICKASSVERSION = '2.0';
  
  var s = document.createElement('script');
  s.type = 'text/javascript';
  
  document.body.appendChild(s);
  
  s.src = '//hi.kickassapp.com/kickass.js';
});

function isElementInViewport (el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

jQuery(document).ready(function() {
  jQuery.localScroll.hash({
    margin: true,
    offset: {
      top: -350,
      left: 0
    }
  });
  jQuery('.titlereactions, .comment-add').localScroll({
    margin: true,
    offset: {
      top: -100,
      left: 0
    }
  });
  
	/* Open/Close menu on mobile devices */
  jQuery('#menubutton').click(function(){
    if (jQuery(window).width() < 768) {
      window.scrollTo(0,0);
    }
		jQuery('#main-menu').toggleClass('active');
		return false;
	});

  var pieces = jQuery('.node .piece');
  var num = 0;
  pieces.each(function() {
    
    var el = jQuery(this);
    
    num++;
    if (num < pieces.length) {
      el.append('<a href="#" class="pager in-article">Show More</a>');
    }
    if (num > 1) {
      el.hide();
    }
    
  });
  
  jQuery('.in-article.pager').click(function(event) {
  
    event.preventDefault();
  
    var el = jQuery(this);
    el.parent().next().relevantSlideIn();
    el.hide();
  });
  
  jQuery('.field-name-comment-body .showmore').each(function() {
    var el = jQuery(this);
    el.before('<a href="#" class="readmore">Show More</a>');
    el.hide();
  });
  
  jQuery('.field-name-comment-body .readmore').click(function(event) {
  
    event.preventDefault();
    
    var el = jQuery(this);
    el.parent().find('.showmore').relevantSlideIn();
    el.hide();
  });
  
  jQuery('.field-name-comment-body .offensive').each(function() {
    var el = jQuery(this);
    el.before('<span class="showoffensive"><strong>This content has been hidden due to having received too many downvotes from the community.</strong><a href="#">Show comment</a></span>');
    el.hide();
    
    jQuery('.showoffensive a').click(function(event) { 
      event.preventDefault();
    
      var el = jQuery(this);
      el.parent().parent().find('.offensive').relevantSlideIn();
      el.parent().hide();
    });
  });
  
  /*(function (d, t) {
    var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
    bh.type = 'text/javascript';
    bh.src = '//www.bugherd.com/sidebarv2.js?apikey=3c9b3afb-d3fb-4626-8909-571d057d7b2d';
    s.parentNode.insertBefore(bh, s);
  })(document, 'script');*/
  
  getTextWidth = function(text, font, lnht, ltspacing, maxw, maxh) {
  
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var ctx = canvas.getContext("2d");
    ctx.font = font;
    
    var words = text.split(' ');
    var line = '';
    var lines = 0;
    
    var retval = '';
    if (ctx.measureText(text).width < maxw) {
      return text;
    }
    
    for (var idx in words) {
      
      var word = words[idx];
      var w = ctx.measureText(line + ' ' + word).width;
      
      if (w < maxw) {
        // It fits in the line. 
        line += ' ' + word;
      }
      else {
        // The line wrapped.
        lines++;
        
        // If we continue adding text, will we go over the max height?
        if ((lnht * (lines+1)) > maxh) {
          // If so, ellipsis.
          return retval + line + '...';
        }
        
        retval += line + ' ' + word + ' ';
        line = '';
        lines++;
      }
    }
    
    return retval + line;
  };
  
  jQuery('.ellipsis').each(function() {
    var el = jQuery(this);
    
    
    
    var width = el.width();
    var height = el.height();
    
    var ftstyle = el.css('font-style');
    var ftweight = el.css('font-weight');
    var ftsize = el.css('font-size');
    
    var ltspacing = el.css('letter-spacing');
    var ftltspacing = 0;
    
    if (ltspacing.indexOf('px') !== -1) {
      ftltspacing = parseInt(ltspacing);
    }
    else if (ltspacing.indexOf('em') !== -1) {
      ftltspacing = 16 * parseInt(ltspacing);
    }
        
    var lnht = el.css('line-height')
    var ftlnheight = (lnht == 'normal' ? 1.14*parseInt(ftsize) + 'px' : lnht);
    var ftfamilies = el.css('font-family');
    var spl = ftfamilies.split(',');
    var ftfamily = spl[0];
    
    var font = ftstyle + ' ' + ftweight + ' ' + ftsize+'/'+ftlnheight + ' ' + ftfamily;
    
    var tw = getTextWidth(el.text().trim(), font, parseInt(ftlnheight), ftltspacing, parseInt(width), parseInt(height)).trim();
    //console.log(font + ', ' + width + '/' + height + ': ' + tw);
    el.text(tw);
  });
  
  jQuery('.share-buttons li.more').once('shareclick').click(function() {
    var el = jQuery(this).find('ul.share-more');
    if (el.css('display') == 'block') {
      el.css('display', 'none');
    }
    else {
      el.css('display', 'block');
    }
  });
  
  jQuery('#block-node-page-default-top-grid > .content').once().carousel();
  
  jQuery('.bean-bag-section-large, #section-menu .content > ul.menu ul.menu').click(function() {
    
    jQuery(this).toggleClass('active');
  });
  
  var domains = ['hotmail.com', 'gmail.com', 'aol.com'];
  var topLevelDomains = ["com", "net", "org"];
  
  jQuery('.form-item-mail input').change(function() {
    jQuery(this).next('.suggestion').remove();
    
    jQuery(this).mailcheck({
      domains: domains,                       // optional
      topLevelDomains: topLevelDomains,       // optional
      distanceFunction: Mailcheck.stringDistance,  // optional
      suggested: function(element, suggestion) {
        // callback code
        jQuery(element).after('<span class="suggestion">Did you mean <a href="#">' + suggestion.full + '</a>?</span>');
        jQuery(element).next('.suggestion').find('a').click(function(event) {
          event.preventDefault();
          
          jQuery(element).val(jQuery(this).text());
          jQuery(this).parent().remove();
        });
      },
      empty: function(element) {
        // callback code
      }
    });
  });
  
  
  var sidebarScrollPos = 0;
  var contentSidebarScrollPos = 0;
  var oldShareTop = parseInt(jQuery('.bodycont .share-buttons.anchored').css('top'));
  
  jQuery(window).resize(updateScrollPos);
  
  function updateScrollPos() {
    
    var el = jQuery('#content-sidebar .block:last-child');
    
    if (el.length > 0) {   
      var old = el.css('position');
      el.css('position', 'static');
      contentSidebarScrollPos = el.offset().top;
      el.css('position', old);
    }
    
    var el = jQuery('#sidebar .block:last-child');
    
    if (el.length > 0) {   
      var old = el.css('position');
      el.css('position', 'static');
      sidebarScrollPos = el.offset().top;
      el.css('position', old);
    }
    
  }
  
  updateScrollPos();
  
  setInterval(updateScrollPos,1000);
  
  var padding = 68;
  
  jQuery(window).scroll(function() {
    var el = jQuery('#block-system-main');
    
    var elBot = el.offset().top + el.innerHeight();
    var winBot = window.scrollY + window.innerHeight;
    
    if (winBot > (elBot - window.innerHeight/2)) {
      //jQuery('body.node-feed #block-system-main .list:not(.animating) > .item-list .pager.bottom a').click();
      jQuery('body.node-feed #block-system-main .item-list .pager.bottom a').click();
    }
    
    // Now do the content sidebar
    var el = jQuery('#content-sidebar .block:last-child');
    
    if (el.length > 0) {    
      el.css('top', padding + 'px');
      el.css('width', jQuery('#content-sidebar').width());
      
      
      if (window.scrollY > (contentSidebarScrollPos - padding)) {
        el.css('position', 'fixed');
      }
      else {
        el.css('position', 'static');
      }
    }
    
    // Now do the sidebar
    var el = jQuery('#sidebar .block:last-child');
    
    if (el.length > 0) {   
      
      el.css('top', padding + 'px');
      el.css('width', jQuery('#sidebar').width());
      
      
      if (window.scrollY > (sidebarScrollPos - padding)) {
        el.css('position', 'fixed');
      }
      else {
        el.css('position', 'static');
      }
    }
    
    // Now do the article share buttons
    
    var el = jQuery('.bodycont .share-buttons.anchored');
    
    if (el.length > 0) {
      
      var elTop = jQuery('.bodycont').offset().top;
      var elBottom = elTop + jQuery('.bodycont').height() - el.height() - 200;
      
      if (window.scrollY - oldShareTop + 200 > elTop) {
        if (window.scrollY > elBottom) {
          el.css('top', jQuery('.bodycont').height() - el.height());
        }
        else {
         el.css('top', window.scrollY - elTop + 200);
        }
      }
      else {
        el.css('top', oldShareTop);
      }
    }
    
  });
  
  jQuery('.share-mobile > li.more > a.more').once('clickok').click(function(event) {
    
    event.preventDefault();
    var el = jQuery('.share-mobile .share-more');
    
    el.toggle();
  });

});
/*
function unfoldRules(rules) {
  var list = [];
  
  for (var r in rules) {
    
    var rule = rules[r];
    
    if (rule instanceof CSSImportRule) {
      var importedRules = unfoldRules(rule.styleSheet.rules || rule.styleSheet.cssRules);
      list = list.concat(importedRules);
    }
    else if (rule instanceof CSSMediaRule) {
      var mediaRules = unfoldRules(rule.rules || rule.cssRules);
      list = list.concat(mediaRules);
    }
    else if (rule instanceof CSSStyleRule) {
      list.push(rule);
    }
  }
  
  return list;
}

function css(element) {
  var sheets = document.styleSheets, output = [];
  element.matches = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector;
  
  for (var i in sheets) {
    var sheet = sheets[i];
    
    var rules = unfoldRules(sheet.rules || sheet.cssRules);
        
    for (var r in rules) {
      var rule = rules[r];
      
      if (element.matches(rule.selectorText)) {
        var style = rule.style;
        
        var property;
        for (var j=0; property = style.item(j); j++) {
          
          if (!output[property]) {
            output[property] = [];
          }
          
          if (rule.parentRule instanceof CSSMediaRule) {
            // media query
            
            if (window.matchMedia(rule.parentRule.media.mediaText).matches) {
              output[property].push([rule, rule.parentStyleSheet.href, '@media ' + rule.parentRule.media.mediaText + ' {' + rule.selectorText + '}', style.cssText]);
            }
            
            // didn't match. do nothing.
            continue;
          }
          
          output[property].push([rule, rule.parentStyleSheet.href, rule.selectorText, style.cssText]);
    	  }
      }
    }
  }
  
  return output;
}
*/;
if (typeof expandableTakeoverSmallHeight != 'undefined' && typeof expandableTakeoverLargeHeight != 'undefined') {

  var expanded;
  
  function setCookie(cookieName,cookieValue,nDays) {
    // function from http://www.javascripter.net/faq/settinga.htm
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
  }
  
  function readCookie(cookieName) {
    // function from http://www.javascripter.net/faq/readinga.htm
    var theCookie=" "+document.cookie;
    var ind=theCookie.indexOf(" "+cookieName+"=");
    if (ind==-1) ind=theCookie.indexOf(";"+cookieName+"=");
    if (ind==-1 || cookieName=="") return "";
    var ind1=theCookie.indexOf(";",ind+1);
    if (ind1==-1) ind1=theCookie.length; 
    return unescape(theCookie.substring(ind+cookieName.length+2,ind1));
  }
  
  function expandTakeover() {
    expanded = true;
    
    setCookie('relevantTakeover','expanded',7);
    
    jQuery('#expandable-ad-small').css('height', '0');
    jQuery('#expandable-ad-large').css('height', expandableTakeoverLargeHeight + 'px');
    jQuery('#expandable-takeover-container').css('height', expandableTakeoverLargeHeight + 'px');
    jQuery('#expand-button').unbind();
    jQuery('#expand-button').html('Collapse <span style="font-size: 5px;line-height: 3px; display: inline-block; position: relative; top: -2px;">â–²</span>');
    jQuery('#expand-button').bind('click', collapseTakeover);
    jQuery('#expand-button').css({
      'width' : '75px',
      'height' : '19px',
      'top' : '2px',
      'right' : '-3px',
      'opacity' : '1'
    });
    
  }
  
  function collapseTakeover() {
    expanded = false;
    
    setCookie('relevantTakeover','collapsed',7);

    jQuery('#expandable-ad-large').css('height', '0');
    jQuery('#expandable-ad-small').css('height', expandableTakeoverSmallHeight + 'px');
    jQuery('#expandable-takeover-container').css('height', expandableTakeoverSmallHeight + 'px');
    jQuery('#expand-button').unbind();
    jQuery('#expand-button').html('Expand <span style="font-size: 5px;line-height: 3px; display: inline-block; position: relative; top: -2px;">â–¼</span>');
    jQuery('#expand-button').bind('click', expandTakeover);
    jQuery('#expand-button').css({
      'width' : '75px',
      'height' : '19px',
      'top' : '2px',
      'right' : '-3px',
      'opacity' : '1'
    });
    
  }
  
  if (readCookie('relevantTakeover') != 'collapsed') {
    expandTakeover();
  } else {
    collapseTakeover();
  }

  //jQuery('#explandable-video').attr('src',jQuery('#explandable-video').attr('data-src'));
  //jQuery('#explandable-video').css('display', 'block');
  
  var videoClicked = false;
  
  jQuery('#expandable-placeholder').click(function() {
    var video = jQuery('#expandable-video')
    var image = jQuery(this);
    
    video.attr('src', video.attr('data-src'));
    video.css('display', 'block');
    image.css('display', 'none');
    
    videoClicked = true;
  });
  
};
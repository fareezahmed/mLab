




/*
     FILE ARCHIVED ON 2:13:34 Feb 25, 2017 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 7:49:21 Mar 4, 2017.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
 * CirclePlayer for the jPlayer Plugin (jQuery)
 * /web/20170225021334/http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2011 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - /web/20170225021334/http://www.opensource.org/licenses/mit-license.php
 *  - /web/20170225021334/http://www.gnu.org/copyleft/gpl.html
 *
 * Version: 1.0.1 (jPlayer 2.0.9)
 * Date: 30th May 2011
 *
 * Author: Mark J Panaghiston @thepag
 *
 * CirclePlayer prototype developed by:
 * Mark Boas @maboa
 * Silvia Benvenuti @aulentina
 * Jussi Kalliokoski @quinirill
 *
 * Inspired by :
 * Neway @imneway /web/20170225021334/http://imneway.net/ /web/20170225021334/http://forrst.com/posts/Untitled-CPt
 * and
 * Liam McKay @liammckay /web/20170225021334/http://dribbble.com/shots/50882-Purple-Play-Pause
 *
 * Standing on the shoulders of :
 * John Resig @jresig
 * Mark Panaghiston @thepag
 * Louis-Rémi Babé @Louis_Remi
 */


var CirclePlayer = function(jPlayerSelector, media, options) {
	var	self = this,

		defaults = {
			// solution: "flash, html", // For testing Flash with CSS3
			supplied: "oga,mp3",
			// Android 2.3 corrupts media element if preload:"none" is used.
			// preload: "none", // No point preloading metadata since no times are displayed. It helps keep the buffer state correct too.
			cssSelectorAncestor: "#cp_container_1",
			cssSelector: {
				play: ".cp-play",
				pause: ".cp-pause"
			}
		},

		cssSelector = {
			bufferHolder: ".cp-buffer-holder",
			buffer1: ".cp-buffer-1",
			buffer2: ".cp-buffer-2",
			progressHolder: ".cp-progress-holder",
			progress1: ".cp-progress-1",
			progress2: ".cp-progress-2",
			circleControl: ".cp-circle-control"
		};

	this.cssClass = {
		gt50: "cp-gt50",
		fallback: "cp-fallback"
	};

	this.spritePitch = 104;
	this.spriteRatio = 0.24; // Number of steps / 100

	this.player = jQuery(jPlayerSelector);
	this.media = jQuery.extend({}, media);
	this.options = jQuery.extend(true, {}, defaults, options); // Deep copy

	this.cssTransforms = Modernizr.csstransforms;
	this.audio = {};
	this.dragging = false; // Indicates if the progressbar is being 'dragged'.

	this.eventNamespace = ".CirclePlayer"; // So the events can easily be removed in destroy.

	this.jq = {};
	jQuery.each(cssSelector, function(entity, cssSel) {
		self.jq[entity] = jQuery(self.options.cssSelectorAncestor + " " + cssSel);
	});

	this._initSolution();
	this._initPlayer();
};

CirclePlayer.prototype = {
	_createHtml: function() {
	},
	_initPlayer: function() {
		var self = this;
		this.player.jPlayer(this.options);

		this.player.bind(jQuery.jPlayer.event.ready + this.eventNamespace, function(event) {
			if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
				self.audio = jQuery(this).data("jPlayer").htmlElement.audio;
			}
			jQuery(this).jPlayer("setMedia", self.media);
			self._initCircleControl();
		});

		this.player.bind(jQuery.jPlayer.event.play + this.eventNamespace, function(event) {
			jQuery(this).jPlayer("pauseOthers");
		});

		// This event fired as play time increments
		this.player.bind(jQuery.jPlayer.event.timeupdate + this.eventNamespace, function(event) {
			if (!self.dragging) {
				self._timeupdate(event.jPlayer.status.currentPercentAbsolute);
			}
		});

		// This event fired as buffered time increments
		this.player.bind(jQuery.jPlayer.event.progress + this.eventNamespace, function(event) {
			var percent = 0;
			if((typeof self.audio.buffered === "object") && (self.audio.buffered.length > 0)) {
				if(self.audio.duration > 0) {
					var bufferTime = 0;
					for(var i = 0; i < self.audio.buffered.length; i++) {
						bufferTime += self.audio.buffered.end(i) - self.audio.buffered.start(i);
						// console.log(i + " | start = " + self.audio.buffered.start(i) + " | end = " + self.audio.buffered.end(i) + " | bufferTime = " + bufferTime + " | duration = " + self.audio.duration);
					}
					percent = 100 * bufferTime / self.audio.duration;
				} // else the Metadata has not been read yet.
				// console.log("percent = " + percent);
			} else { // Fallback if buffered not supported
				// percent = event.jPlayer.status.seekPercent;
				percent = 0; // Cleans up the inital conditions on all browsers, since seekPercent defaults to 100 when object is undefined.
			}
			self._progress(percent); // Problem here at initial condition. Due to the Opera clause above of buffered.length > 0 above... Removing it means Opera's white buffer ring never shows like with polyfill.
			// Firefox 4 does not always give the final progress event when buffered = 100%
		});

		this.player.bind(jQuery.jPlayer.event.ended + this.eventNamespace, function(event) {
			self._resetSolution();
		});
	},
	_initSolution: function() {
		if (this.cssTransforms) {
			this.jq.progressHolder.show();
			this.jq.bufferHolder.show();
		}
		else {
			this.jq.progressHolder.addClass(this.cssClass.gt50).show();
			this.jq.progress1.addClass(this.cssClass.fallback);
			this.jq.progress2.hide();
			this.jq.bufferHolder.hide();
		}
		this._resetSolution();
	},
	_resetSolution: function() {
		if (this.cssTransforms) {
			this.jq.progressHolder.removeClass(this.cssClass.gt50);
			this.jq.progress1.css({'transform': 'rotate(0deg)'});
			this.jq.progress2.css({'transform': 'rotate(0deg)'}).hide();
		}
		else {
			this.jq.progress1.css('background-position', '0 ' + this.spritePitch + 'px');
		}
	},
	_initCircleControl: function() {
		var self = this;
		this.jq.circleControl.grab({
			onstart: function(){
				self.dragging = true;
			}, onmove: function(event){
				var pc = self._getArcPercent(event.position.x, event.position.y);
				self.player.jPlayer("playHead", pc).jPlayer("play");
				self._timeupdate(pc);
			}, onfinish: function(event){
				self.dragging = false;
				var pc = self._getArcPercent(event.position.x, event.position.y);
				self.player.jPlayer("playHead", pc).jPlayer("play");
			}
		});
	},
	_timeupdate: function(percent) {
		var degs = percent * 3.6+"deg";

		var spriteOffset = (Math.floor((Math.round(percent))*this.spriteRatio)-1)*-this.spritePitch;

		if (percent <= 50) {
			if (this.cssTransforms) {
				this.jq.progressHolder.removeClass(this.cssClass.gt50);
				this.jq.progress1.css({'transform': 'rotate(' + degs + ')'});
				this.jq.progress2.hide();
			} else { // fall back
				this.jq.progress1.css('background-position', '0 '+spriteOffset+'px');
			}
		} else if (percent <= 100) {
			if (this.cssTransforms) {
				this.jq.progressHolder.addClass(this.cssClass.gt50);
				this.jq.progress1.css({'transform': 'rotate(180deg)'});
				this.jq.progress2.css({'transform': 'rotate(' + degs + ')'});
				this.jq.progress2.show();
			} else { // fall back
				this.jq.progress1.css('background-position', '0 '+spriteOffset+'px');
			}
		}
	},
	_progress: function(percent) {
		var degs = percent * 3.6+"deg";

		if (this.cssTransforms) {
			if (percent <= 50) {
				this.jq.bufferHolder.removeClass(this.cssClass.gt50);
				this.jq.buffer1.css({'transform': 'rotate(' + degs + ')'});
				this.jq.buffer2.hide();
			} else if (percent <= 100) {
				this.jq.bufferHolder.addClass(this.cssClass.gt50);
				this.jq.buffer1.css({'transform': 'rotate(180deg)'});
				this.jq.buffer2.show();
				this.jq.buffer2.css({'transform': 'rotate(' + degs + ')'});
			}
		}
	},
	_getArcPercent: function(pageX, pageY) {
		var	offset	= this.jq.circleControl.offset(),
			x	= pageX - offset.left - this.jq.circleControl.width()/2,
			y	= pageY - offset.top - this.jq.circleControl.height()/2,
			theta	= Math.atan2(y,x);

		if (theta > -1 * Math.PI && theta < -0.5 * Math.PI) {
			theta = 2 * Math.PI + theta;
		}

		// theta is now value between -0.5PI and 1.5PI
		// ready to be normalized and applied

		return (theta + Math.PI / 2) / 2 * Math.PI * 10;
	},
	setMedia: function(media) {
		this.media = jQuery.extend({}, media);
		this.player.jPlayer("setMedia", this.media);
	},
	play: function(time) {
		this.player.jPlayer("play", time);
	},
	pause: function(time) {
		this.player.jPlayer("pause", time);
	},
	destroy: function() {
		this.player.unbind(this.eventNamespace);
		this.player.jPlayer("destroy");
	}
};
;
var circlePlayers = new Object();
var lastAudio = null;

Drupal.behaviors.audio = { 
  attach: function(context, settings) {
    var playlist = (jQuery('#playlist').length > 0);
  
    jQuery.each(settings.audio, function(index, value) {
      var player = new CirclePlayer("#"+index,
  		{
  			mp3: atob(value.huff),
  			oga: atob(value.glue)
  		}, {
  			cssSelectorAncestor: "#"+index+"-controls",
  			preload: 'none',
  			swfPath: settings.basePath + 'sites/default/modules/audio/libraries/jplayer/jplayer.swf'
  		});
  		
  		circlePlayers[index] = player;
  		
  		if (playlist) {
  		  player.player.bind(jQuery.jPlayer.event.ready, checkPlayList);
  		}

    });
    
    if (playlist) {
      jQuery('#playlist-controls .cp-play, #playlist-controls .cp-pause').once().click(function(event) {
        event.preventDefault();
        
        if (lastAudio == null) {
      		for (first in circlePlayers) break;
      		lastAudio = circlePlayers[first].audio;
    		}
        
        var list = jQuery('.node .cp-jplayer');
        
        var pause = jQuery('#playlist-controls .cp-pause');
        if (jQuery('#playlist-controls .cp-pause').css('display') == 'none') {
          // User played.
          jQuery('#playlist-controls .cp-pause').css('display', 'block');
          jQuery('#playlist-controls .cp-play').css('display', 'none');
          lastAudio.play();
        }
        else {
          // User paused.
          jQuery('#playlist-controls .cp-pause').css('display', 'none');
          jQuery('#playlist-controls .cp-play').css('display', 'block');
          lastAudio.pause();
        }
      });
    }
    
    jQuery('body').once('playtime', function() {
      for (idx in circlePlayers) {
        var el = jQuery('.large #' + idx + '-controls');
        el.after('<div class="playtime" id="' + idx + '-status"></div>');
      }
      
      setTimeout(audioTick, 500);
    });
    
  },
};

function audioTick() {
  
  for (idx in circlePlayers) {
    audio = circlePlayers[idx].audio;
    
    var status = jQuery('.large #' + idx + '-status');
    
    if (status.length == 0) {
      continue;
    }
    
    var total = Math.round(audio.currentTime);
    
    var secs = total % 60;
    var mins = Math.floor(total/60);
    
    var timeStr = '';
    if (mins < 10) {
      timeStr += '0' + mins;
    }
    else {
      timeStr += mins;
    }
    
    timeStr += ':';
    
    if (secs < 10) {
      timeStr += '0' + secs;
    }
    else {
      timeStr += secs;
    }
    
    status.html(timeStr);
  }
  
  setTimeout(audioTick, 500);
}

function playTrack() {
  jQuery('#playlist-controls .cp-pause').css('display', 'block');
  jQuery('#playlist-controls .cp-play').css('display', 'none');
  
  lastAudio = this;
}

function pauseTrack() {

  var allpaused = true;
  
  for (var prop in circlePlayers) {
    if (typeof(circlePlayers[prop]) != 'object'  || !circlePlayers.hasOwnProperty(prop)) {
      continue;
    }
    
    if (!circlePlayers[prop].audio.paused) {
      allpaused = false;
    }
  }
  
  if (allpaused) {
    jQuery('#playlist-controls .cp-pause').css('display', 'none');
    jQuery('#playlist-controls .cp-play').css('display', 'block');
  }
}

// Generate a list of the tracks
function nextTrack() {
  var idx = jQuery(this).data('idx');

  var next = elemAfter(circlePlayers, idx);
  if (next != null) {
    next.audio.play();
  }
}

function elemAfter(obj, idx) {
  
  var found = false;
  
  for (var prop in obj) {
    if (typeof(obj[prop]) != 'object'  || !obj.hasOwnProperty(prop)) {
      continue;
    }
    
    if (found == true) {
      return obj[prop];
    }
    
    if (prop == idx) {
      found = true;
    }
  }
  
  return false;
}

function checkPlayList(event) {

  var id = event.target.id;
  var obj = circlePlayers[id];

  if (jQuery('.page-node .album-art').length > 0) {
  
    jQuery(obj.audio).data('idx', id);

    obj.audio.addEventListener('ended', nextTrack);
    obj.audio.addEventListener('pause', pauseTrack);
    obj.audio.addEventListener('play', playTrack);
  }
};
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
jQuery.fn.changeHistory = function(title, url) {
  window.history.replaceState( {} , title, url);
}

Drupal.behaviors.ajax = { 
  attach: function(context, settings) {
  
    jQuery('.ajax-link:not(.not-loading)').once('loading').click(function() {
      jQuery(this).html('Loading&hellip;');
    });
    
    jQuery('.pager-next a.ajax-link, .pager-previous a.ajax-link').text('Show More');
    
    // Custom Text
    jQuery('.comment-wrapper .pager-next a.ajax-link').text('Show Older');
    jQuery('.comment-wrapper .pager-previous a.ajax-link').text('Show Newer');
    jQuery('.page-forum .pager-next a.ajax-link').text('Show Older');
    jQuery('.page-forum .pager-previous a.ajax-link').text('Show Newer');
    
    // Bind Ajax behaviors to all items showing the class.
    jQuery('.ajax-link').once('ajax').each(function () {
      var element_settings = {};
      // Clicked links look better without any progress indicator
      element_settings.progress = { 'type': 'none' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if (jQuery(this).attr('href')) {
        var url = new Uri(jQuery(this).attr('href'));
        element_settings.url = url.toString();
        element_settings.event = 'click';
      }
      
      var base = jQuery(this).attr('id');
      
      if (jQuery('ul.pager:has(#'+base+')').hasClass('top')) {
        position = 'top';
      }
      else {
        position = 'bottom';
      }
      
      element_settings.submit = {
        base: base,
        position: position,
        send: settings.ajax.send
      }
      
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
    
    // Bind Ajax behaviors to all items showing the class.
    /*
    jQuery('.ajax-link:not(.ajax-processed)').addClass('ajax-processed').each(function () {
    
      var element_settings = {};
      // Clicked links look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'none' };
      
      var base = jQuery(this).attr('id');
      
      var position = false;
      if (jQuery('ul.pager:has(#'+base+')').hasClass('bottom')) {
        position = 'bottom';
      } else if (jQuery('ul.pager:has(#'+base+')').hasClass('top')) {
        position = 'top'
      }
      
      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if (jQuery(this).attr('href')) {
        var url = new Uri(jQuery(this).attr('href'));
        if (jQuery(this).hasClass('ajax-pager')) {
          url.setPath(Drupal.settings.basePath+Drupal.settings.ajax.path+'/ajax');
        } else {
          url.setPath(url.path()+'/ajax');
        }
        if (position) {
          url.deleteQueryParam('position');
          url.addQueryParam('position', encodeURIComponent(position));
        }
        url.deleteQueryParam('base');
        url.addQueryParam('base', encodeURIComponent(base));
        element_settings.url = url.toString();
        element_settings.event = 'click';
      }
    
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      
    });
    */
    
    jQuery.fn.ajaxSlide = function() {
      jQuery(this).addClass('animating');
      jQuery(this).animate({
        opacity: 1,
        height: 'toggle'
      }, 'slow', function() {
        jQuery(this).removeClass('animating');
      });
      
    };
    
    jQuery('.js_load_placehold').once('ajax').each( function() {
      var element_settings = {};
      // Clicked links look better without any progress indicator
      element_settings.progress = { 'type': 'none' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if (jQuery(this).attr('data-url')) {
        var url = new Uri(jQuery(this).attr('data-url'));
        element_settings.url = url.toString();
        element_settings.event = 'click';
      }
      
      var base = jQuery(this).attr('id');
      
      element_settings.submit = {
        base: base,
        first: true,
        send: settings.ajax.send
      }
      
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      
      jQuery(this).trigger('click');
    });
    
    jQuery.fn.rebindClick = function() {
      var attrib = jQuery(this).parents('.node').attr('id');
      var id = attrib.substr(5);
      
      var element_settings = {};
      // Clicked links look better without any progress indicator
      element_settings.progress = { 'type': 'none' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.

      var url = new Uri(Drupal.settings.ajax.edit_url + '/' + id);
      element_settings.url = url.toString();
      element_settings.event = 'dblclick';
      
      var base = attrib;
      
      element_settings.submit = {
        base: attrib,
      }
      
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    };
    
    if (Drupal.settings.ajax.edit_url) {
      jQuery('.node .field-name-body').once('ajax').each( function() {
        jQuery(this).rebindClick();
      });
    }
    
  },  
};  
  
  
;
Drupal.behaviors.facebook_sdk = { 
  attach: function(context, settings) {
      
    jQuery('#fb-root').once('facebook-sdk', function(d, s, id) {
      /*var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId="+Drupal.settings.facebook_sdk.appid;
      fjs.parentNode.insertBefore(js, fjs);*/
      
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=" + Drupal.settings.facebook_sdk.appid;
      fjs.parentNode.insertBefore(js, fjs);
      
    }(document, 'script', 'facebook-jssdk'));
    
  },  
};  
;
Drupal.behaviors.share_buttons = { 
  attach: function(context, settings) {
    
  // Popup Windows
	jQuery('.share-buttons a.popup').once('popup').popupWindow({ 
		centerScreen: 1,
		height: 353, 
		width: 640
	});
		 
		  
}};  
;
Drupal.behaviors.newsletter_signup = { 
  attach: function(context, settings) {
    
    jQuery('.bean-newsletter-signup .form-submit').click(function() {
       _gaq.push(['_trackEvent', 'Newsletter', 'Signup', 'Right Rail Form']);
    });
  },  
};  ;
Drupal.behaviors.paywall = { 
  attach: function(context, settings) {
    
    jQuery('.paywall.intro h3.login').colorbox({opacity: 0.75, inline: true, href: ".paywall.login", scrolling: false});
    
    jQuery('.paywall.intro h3.register').colorbox({opacity: 0.75, inline: true, href: ".paywall.register", scrolling: false});
    
  },
};;
Drupal.behaviors.optin = { 
  attach: function(context, settings) {
    jQuery('.user-register-form').once('optin').each(function() {
      
      var parent = jQuery(this);
      
      function changeInput() {
        var input = parent.find('.form-item-optin input');
        
        if (input.prop('checked')) {
          parent.find('.form-submit').removeAttr('disabled');
          parent.find('.form-submit').addClass('form-button-disabled');
        }
        else {
          parent.find('.form-submit').attr('disabled','disabled');
          parent.find('.form-submit').removeClass('form-button-disabled');
        }
      }
      
      changeInput();
      parent.find('.form-item-optin input').change(changeInput);
      
    });
  },  
};  
;

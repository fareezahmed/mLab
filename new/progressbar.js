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





/*
     FILE ARCHIVED ON 5:58:12 Jan 2, 2017 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 7:49:18 Mar 4, 2017.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/**
 * @file
 * Javascript functionality for Facebook Instant Articles Display module.
 */

(function ($) {
  'use strict';

  // Row handlers for the 'Manage display' screen.
  Drupal.fieldUIDisplayOverview = Drupal.fieldUIDisplayOverview || {};

  Drupal.fieldUIDisplayOverview.facebookInstantArticlesDisplay = function (row, data) {

    this.row = row;
    this.name = data.name;
    this.region = data.region;
    this.tableDrag = data.tableDrag;

    // Attach change listener to the 'region' select.
    this.$regionSelect = $('select.ds-field-region', row);
    this.$regionSelect.change(Drupal.fieldUIOverview.onChange);

    // Attach change listener to the 'formatter type' select.
    this.$formatSelect = $('select.field-formatter-type', row);
    this.$formatSelect.change(Drupal.fieldUIOverview.onChange);

    return this;
  };

  Drupal.fieldUIDisplayOverview.facebookInstantArticlesDisplay.prototype = {

    /**
     * Returns the region corresponding to the current form values of the row.
     */
    getRegion: function () {
      return this.$regionSelect.val();
    },

    /**
     * Reacts to a row being changed regions.
     *
     * This function is called when the row is moved to a different region, as a
     * result of either :
     * - a drag-and-drop action
     * - user input in one of the form elements watched by the
     *   Drupal.fieldUIOverview.onChange change listener.
     *
     * @param region
     *   The name of the new region for the row.
     *
     * @return
     *   A hash object indicating which rows should be AJAX-updated as a result
     *   of the change, in the format expected by
     *   Drupal.displayOverview.AJAXRefreshRows().
     */
    regionChange: function (region) {

      // Replace dashes with underscores.
      region = region.replace(/-/g, '_');

      // Set the region of the select list.
      this.$regionSelect.val(region);

      // Prepare rows to be refreshed in the form.
      var refreshRows = {};
      refreshRows[this.name] = this.$regionSelect.get(0);

      // If a row is handled by field_group module, loop through the children.
      if ($(this.row).hasClass('field-group') && $.isFunction(Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields)) {
        Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields(region, this, refreshRows);
      }

      return refreshRows;
    }
  };

})(jQuery);
;
/**
 * @file
 * Modifies the file selection and download access expiration interfaces.
 */

var uc_file_list = {};

/**
 * Adds files to delete to the list.
 */
function _uc_file_delete_list_populate() {
  jQuery('.affected-file-name').empty().append(uc_file_list[jQuery('#edit-recurse-directories').attr('checked')]);
}

jQuery(document).ready(
  function() {
    _uc_file_delete_list_populate();
  }
);

// When you (un)check the recursion option on the file deletion form.
Drupal.behaviors.ucFileDeleteList = {
  attach: function(context, settings) {
    jQuery('#edit-recurse-directories:not(.ucFileDeleteList-processed)', context).addClass('ucFileDeleteList-processed').change(
      function() {
        _uc_file_delete_list_populate()
      }
    );
  }
}

/**
 * Give visual feedback to the user about download numbers.
 *
 * TODO: would be to use AJAX to get the new download key and
 * insert it into the link if the user hasn't exceeded download limits.
 * I dunno if that's technically feasible though.
 */
function uc_file_update_download(id, accessed, limit) {
  if (accessed < limit || limit == -1) {

    // Handle the max download number as well.
    var downloads = '';
    downloads += accessed + 1;
    downloads += '/';
    downloads += limit == -1 ? 'Unlimited' : limit;
    jQuery('td#download-' + id).html(downloads);
    jQuery('td#download-' + id).attr("onclick", "");
  }
}
;

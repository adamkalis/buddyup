'use strict';

/* global User, nunjucks  */

(function(exports) {

  var LOCALES = ['en-US', 'fr', 'de'];
  var HANDSETS = ['Alcatel', 'Flame'];
  var OPERATORS = ['Movistar', 'MTN'];

  /**
   * Get the list of selected handset types from the form element and returns
   * them as an array.
   * @param {array} selected_options - The selected handset types
   * @returns {array} Selected handset types as an array
   */
  function get_selected_handset_types(selected_options) {
    var handset_types = [];
    for (var i = 0, l = selected_options.length; i < l; i++) {
      handset_types.push(selected_options[i].value);
    }
    return handset_types;
  }

  /**
   * Collect information from the profile form on submission and
   * submits new data to server.
   */
  function update_user(evt) {
    evt.preventDefault();

    var user = {};
    var settings = [];
    var form = document.getElementById('profile');
    var profile_elements = ['display_name', 'new_comment_notify',
      'buddyup_reminder', 'locale', 'handset_type', 'operator'];

    for (var i = 0, l = profile_elements.length; i < l; i++) {
      var elem_name = profile_elements[i];
      var elem = form.elements[profile_elements[i]];
      if (!elem) {
        break;
      }

      switch(elem_name) {
        case 'handset_type':
          settings.push({
            name: elem_name,
            value: get_selected_handset_types(elem.selectedOptions)
          });
          break;
        case 'operator':
          settings.push({
            name: elem_name,
            value: elem.value
          });
          break;
        case 'new_comment_notify':
        case 'buddyup_reminder':
          settings.push({
            'name': elem_name,
            'value': elem.checked
          });
          break;
        default:
          user[elem_name] = elem.value;
      }
    }

    var user_data = {
      user: user,
      settings: settings
    };
    // update the user details
    User.update_user(user_data);
  }

  /**
   * Register the event handler for the profile form.
   */
  function register_form() {
    var profile = document.getElementById('profile');
    profile.addEventListener('submit', update_user);
  }

  var ProfileController = {
    init: function() {

      var promises = [];
      promises.push(User.is_helper());
      promises.push(User.get_user());
      Promise.all(promises).then(function([is_helper, user]) {
        var html = nunjucks.render('my-profile.html', {
          user: user,
          locales: LOCALES,
          handsets: HANDSETS,
          operators: OPERATORS,
          is_helper: is_helper
        });

        document.querySelector('#my-profile').innerHTML = html;
        register_form();
      });
    }
  };

  exports.ProfileController = ProfileController;
  ProfileController.init();

})(window);

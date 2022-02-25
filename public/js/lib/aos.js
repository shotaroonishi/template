"use strict";

var _aos = _interopRequireDefault(require("./../sass/aos.scss"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _lodash2 = _interopRequireDefault(require("lodash.debounce"));

var _observer = _interopRequireDefault(require("./libs/observer"));

var _detector = _interopRequireDefault(require("./helpers/detector"));

var _handleScroll = _interopRequireDefault(require("./helpers/handleScroll"));

var _prepare = _interopRequireDefault(require("./helpers/prepare"));

var _elements = _interopRequireDefault(require("./helpers/elements"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * *******************************************************
 * AOS (Animate on scroll) - wowjs alternative
 * made to animate elements on scroll in both directions
 * *******************************************************
 */
// Modules & helpers

/**
 * Private variables
 */
var $aosElements = [];
var initialized = false;
/**
 * Default options
 */

var options = {
  offset: 120,
  delay: 0,
  easing: 'ease',
  duration: 400,
  disable: false,
  once: false,
  startEvent: 'DOMContentLoaded',
  throttleDelay: 99,
  debounceDelay: 50,
  disableMutationObserver: false
};
/**
 * Refresh AOS
 */

var refresh = function refresh() {
  var initialize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  // Allow refresh only when it was first initialized on startEvent
  if (initialize) initialized = true;

  if (initialized) {
    // Extend elements objects in $aosElements with their positions
    $aosElements = (0, _prepare.default)($aosElements, options); // Perform scroll event, to refresh view and show/hide elements

    (0, _handleScroll.default)($aosElements, options.once);
    return $aosElements;
  }
};
/**
 * Hard refresh
 * create array with new elements and trigger refresh
 */


var refreshHard = function refreshHard() {
  $aosElements = (0, _elements.default)();
  refresh();
};
/**
 * Disable AOS
 * Remove all attributes to reset applied styles
 */


var disable = function disable() {
  $aosElements.forEach(function (el, i) {
    el.node.removeAttribute('data-aos');
    el.node.removeAttribute('data-aos-easing');
    el.node.removeAttribute('data-aos-duration');
    el.node.removeAttribute('data-aos-delay');
  });
};
/**
 * Check if AOS should be disabled based on provided setting
 */


var isDisabled = function isDisabled(optionDisable) {
  return optionDisable === true || optionDisable === 'mobile' && _detector.default.mobile() || optionDisable === 'phone' && _detector.default.phone() || optionDisable === 'tablet' && _detector.default.tablet() || typeof optionDisable === 'function' && optionDisable() === true;
};
/**
 * Initializing AOS
 * - Create options merging defaults with user defined options
 * - Set attributes on <body> as global setting - css relies on it
 * - Attach preparing elements to options.startEvent,
 *   window resize and orientation change
 * - Attach function that handle scroll and everything connected to it
 *   to window scroll event and fire once document is ready to set initial state
 */


var init = function init(settings) {
  options = Object.assign(options, settings); // Create initial array with elements -> to be fullfilled later with prepare()

  $aosElements = (0, _elements.default)(); // Detect not supported browsers (<=IE9)
  // http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805

  var browserNotSupported = document.all && !window.atob;
  /**
   * Don't init plugin if option `disable` is set
   * or when browser is not supported
   */

  if (isDisabled(options.disable) || browserNotSupported) {
    return disable();
  }
  /**
   * Set global settings on body, based on options
   * so CSS can use it
   */


  document.querySelector('body').setAttribute('data-aos-easing', options.easing);
  document.querySelector('body').setAttribute('data-aos-duration', options.duration);
  document.querySelector('body').setAttribute('data-aos-delay', options.delay);
  /**
   * Handle initializing
   */

  if (options.startEvent === 'DOMContentLoaded' && ['complete', 'interactive'].indexOf(document.readyState) > -1) {
    // Initialize AOS if default startEvent was already fired
    refresh(true);
  } else if (options.startEvent === 'load') {
    // If start event is 'Load' - attach listener to window
    window.addEventListener(options.startEvent, function () {
      refresh(true);
    });
  } else {
    // Listen to options.startEvent and initialize AOS
    document.addEventListener(options.startEvent, function () {
      refresh(true);
    });
  }
  /**
   * Refresh plugin on window resize or orientation change
   */


  window.addEventListener('resize', (0, _lodash2.default)(refresh, options.debounceDelay, true));
  window.addEventListener('orientationchange', (0, _lodash2.default)(refresh, options.debounceDelay, true));
  /**
   * Handle scroll event to animate elements on scroll
   */

  window.addEventListener('scroll', (0, _lodash.default)(function () {
    (0, _handleScroll.default)($aosElements, options.once);
  }, options.throttleDelay));
  /**
   * Observe [aos] elements
   * If something is loaded by AJAX
   * it'll refresh plugin automatically
   */

  if (!options.disableMutationObserver) {
    (0, _observer.default)('[data-aos]', refreshHard);
  }

  return $aosElements;
};
/**
 * Export Public API
 */


module.exports = {
  init: init,
  refresh: refresh,
  refreshHard: refreshHard
};
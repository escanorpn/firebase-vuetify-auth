(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('vuex'), require('firebase/auth'), require('vuetify/lib')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'vuex', 'firebase/auth', 'vuetify/lib'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AuthGuard = {}, global.vue, global.vuex, global["firebase/auth"], global["vuetify/lib"]));
})(this, (function (exports, Vue, Vuex, auth, lib) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);
  var Vuex__default = /*#__PURE__*/_interopDefaultLegacy(Vuex);

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments$1[i] != null ? arguments$1[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var placeholderChar = '_';
  var strFunction = 'function';

  var emptyArray$1 = [];
  function convertMaskToPlaceholder() {
    var mask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emptyArray$1;
    var placeholderChar$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : placeholderChar;

    if (!isArray(mask)) {
      throw new Error('Text-mask:convertMaskToPlaceholder; The mask property must be an array.');
    }

    if (mask.indexOf(placeholderChar$1) !== -1) {
      throw new Error('Placeholder character must not be used as part of the mask. Please specify a character ' + 'that is not present in your mask as your placeholder character.\n\n' + "The placeholder character that was received is: ".concat(JSON.stringify(placeholderChar$1), "\n\n") + "The mask that was received is: ".concat(JSON.stringify(mask)));
    }

    return mask.map(function (char) {
      return char instanceof RegExp ? placeholderChar$1 : char;
    }).join('');
  }
  function isArray(value) {
    return Array.isArray && Array.isArray(value) || value instanceof Array;
  }
  var strCaretTrap = '[]';
  function processCaretTraps(mask) {
    var indexes = [];
    var indexOfCaretTrap;

    while (indexOfCaretTrap = mask.indexOf(strCaretTrap), indexOfCaretTrap !== -1) {
      indexes.push(indexOfCaretTrap);
      mask.splice(indexOfCaretTrap, 1);
    }

    return {
      maskWithoutCaretTraps: mask,
      indexes: indexes
    };
  }

  var emptyArray = [];
  var emptyString = '';
  function conformToMask() {
    var rawValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emptyString;
    var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyArray;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!isArray(mask)) {
      if (_typeof(mask) === strFunction) {
        mask = mask(rawValue, config);
        mask = processCaretTraps(mask).maskWithoutCaretTraps;
      } else {
        throw new Error('Text-mask:conformToMask; The mask property must be an array.');
      }
    }

    var _config$guide = config.guide,
        guide = _config$guide === void 0 ? true : _config$guide,
        _config$previousConfo = config.previousConformedValue,
        previousConformedValue = _config$previousConfo === void 0 ? emptyString : _config$previousConfo,
        _config$placeholderCh = config.placeholderChar,
        placeholderChar$1 = _config$placeholderCh === void 0 ? placeholderChar : _config$placeholderCh,
        _config$placeholder = config.placeholder,
        placeholder = _config$placeholder === void 0 ? convertMaskToPlaceholder(mask, placeholderChar$1) : _config$placeholder,
        currentCaretPosition = config.currentCaretPosition,
        keepCharPositions = config.keepCharPositions;
    var suppressGuide = guide === false && previousConformedValue !== undefined;
    var rawValueLength = rawValue.length;
    var previousConformedValueLength = previousConformedValue.length;
    var placeholderLength = placeholder.length;
    var maskLength = mask.length;
    var editDistance = rawValueLength - previousConformedValueLength;
    var isAddition = editDistance > 0;
    var indexOfFirstChange = currentCaretPosition + (isAddition ? -editDistance : 0);
    var indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);

    if (keepCharPositions === true && !isAddition) {
      var compensatingPlaceholderChars = emptyString;

      for (var i = indexOfFirstChange; i < indexOfLastChange; i++) {
        if (placeholder[i] === placeholderChar$1) {
          compensatingPlaceholderChars += placeholderChar$1;
        }
      }

      rawValue = rawValue.slice(0, indexOfFirstChange) + compensatingPlaceholderChars + rawValue.slice(indexOfFirstChange, rawValueLength);
    }

    var rawValueArr = rawValue.split(emptyString).map(function (char, i) {
      return {
        char: char,
        isNew: i >= indexOfFirstChange && i < indexOfLastChange
      };
    });

    for (var _i = rawValueLength - 1; _i >= 0; _i--) {
      var char = rawValueArr[_i].char;

      if (char !== placeholderChar$1) {
        var shouldOffset = _i >= indexOfFirstChange && previousConformedValueLength === maskLength;

        if (char === placeholder[shouldOffset ? _i - editDistance : _i]) {
          rawValueArr.splice(_i, 1);
        }
      }
    }

    var conformedValue = emptyString;
    var someCharsRejected = false;

    placeholderLoop: for (var _i2 = 0; _i2 < placeholderLength; _i2++) {
      var charInPlaceholder = placeholder[_i2];

      if (charInPlaceholder === placeholderChar$1) {
        if (rawValueArr.length > 0) {
          while (rawValueArr.length > 0) {
            var _rawValueArr$shift = rawValueArr.shift(),
                rawValueChar = _rawValueArr$shift.char,
                isNew = _rawValueArr$shift.isNew;

            if (rawValueChar === placeholderChar$1 && suppressGuide !== true) {
              conformedValue += placeholderChar$1;
              continue placeholderLoop;
            } else if (mask[_i2].test(rawValueChar)) {
              if (keepCharPositions !== true || isNew === false || previousConformedValue === emptyString || guide === false || !isAddition) {
                conformedValue += rawValueChar;
              } else {
                var rawValueArrLength = rawValueArr.length;
                var indexOfNextAvailablePlaceholderChar = null;

                for (var _i3 = 0; _i3 < rawValueArrLength; _i3++) {
                  var charData = rawValueArr[_i3];

                  if (charData.char !== placeholderChar$1 && charData.isNew === false) {
                    break;
                  }

                  if (charData.char === placeholderChar$1) {
                    indexOfNextAvailablePlaceholderChar = _i3;
                    break;
                  }
                }

                if (indexOfNextAvailablePlaceholderChar !== null) {
                  conformedValue += rawValueChar;
                  rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);
                } else {
                  _i2--;
                }
              }

              continue placeholderLoop;
            } else {
              someCharsRejected = true;
            }
          }
        }

        if (suppressGuide === false) {
          conformedValue += placeholder.substr(_i2, placeholderLength);
        }

        break;
      } else {
        conformedValue += charInPlaceholder;
      }
    }

    if (suppressGuide && isAddition === false) {
      var indexOfLastFilledPlaceholderChar = null;

      for (var _i4 = 0; _i4 < conformedValue.length; _i4++) {
        if (placeholder[_i4] === placeholderChar$1) {
          indexOfLastFilledPlaceholderChar = _i4;
        }
      }

      if (indexOfLastFilledPlaceholderChar !== null) {
        conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1);
      } else {
        conformedValue = emptyString;
      }
    }

    return {
      conformedValue: conformedValue,
      meta: {
        someCharsRejected: someCharsRejected
      }
    };
  }

  var NEXT_CHAR_OPTIONAL = {
    __nextCharOptional__: true
  };
  var defaultMaskReplacers = {
    '#': /\d/,
    A: /[a-z]/i,
    N: /[a-z0-9]/i,
    '?': NEXT_CHAR_OPTIONAL,
    X: /./
  };

  var stringToRegexp = function stringToRegexp(str) {
    var lastSlash = str.lastIndexOf('/');
    return new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
  };

  var makeRegexpOptional = function makeRegexpOptional(charRegexp) {
    return stringToRegexp(charRegexp.toString().replace(/.(\/)[gmiyus]{0,6}$/, function (match) {
      return match.replace('/', '?/');
    }));
  };

  var escapeIfNeeded = function escapeIfNeeded(char) {
    return '[\\^$.|?*+()'.indexOf(char) > -1 ? "\\".concat(char) : char;
  };

  var charRegexp = function charRegexp(char) {
    return new RegExp("/[".concat(escapeIfNeeded(char), "]/"));
  };

  var isRegexp$1 = function isRegexp(entity) {
    return entity instanceof RegExp;
  };

  var castToRegexp = function castToRegexp(char) {
    return isRegexp$1(char) ? char : charRegexp(char);
  };

  function maskToRegExpMask(mask) {
    var maskReplacers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMaskReplacers;
    return mask.map(function (char, index, array) {
      var maskChar = maskReplacers[char] || char;
      var previousChar = array[index - 1];
      var previousMaskChar = maskReplacers[previousChar] || previousChar;

      if (maskChar === NEXT_CHAR_OPTIONAL) {
        return null;
      }

      if (previousMaskChar === NEXT_CHAR_OPTIONAL) {
        return makeRegexpOptional(castToRegexp(maskChar));
      }

      return maskChar;
    }).filter(Boolean);
  }

  function stringMaskToRegExpMask(stringMask) {
    var maskReplacers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMaskReplacers;
    return maskToRegExpMask(stringMask.split(''), maskReplacers);
  }
  function arrayMaskToRegExpMask(arrayMask) {
    var maskReplacers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMaskReplacers;
    var flattenedMask = arrayMask.map(function (part) {
      if (part instanceof RegExp) {
        return part;
      }

      if (typeof part === 'string') {
        return part.split('');
      }

      return null;
    }).filter(Boolean).reduce(function (mask, part) {
      return mask.concat(part);
    }, []);
    return maskToRegExpMask(flattenedMask, maskReplacers);
  }

  var trigger = function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  };
  var queryInputElementInside = function queryInputElementInside(el) {
    return el instanceof HTMLInputElement ? el : el.querySelector('input') || el;
  };
  var isFunction = function isFunction(val) {
    return typeof val === 'function';
  };
  var isString = function isString(val) {
    return typeof val === 'string';
  };
  var isRegexp = function isRegexp(val) {
    return val instanceof RegExp;
  };

  function parseMask(inputMask, maskReplacers) {
    if (Array.isArray(inputMask)) {
      return arrayMaskToRegExpMask(inputMask, maskReplacers);
    }

    if (isFunction(inputMask)) {
      return inputMask;
    }

    if (isString(inputMask) && inputMask.length > 0) {
      return stringMaskToRegExpMask(inputMask, maskReplacers);
    }

    return inputMask;
  }

  function createOptions() {
    var elementOptions = new Map();
    var defaultOptions = {
      previousValue: '',
      mask: []
    };

    function get(el) {
      return elementOptions.get(el) || _objectSpread2({}, defaultOptions);
    }

    function partiallyUpdate(el, newOptions) {
      elementOptions.set(el, _objectSpread2(_objectSpread2({}, get(el)), newOptions));
    }

    function remove(el) {
      elementOptions.delete(el);
    }

    return {
      partiallyUpdate: partiallyUpdate,
      remove: remove,
      get: get
    };
  }

  function extendMaskReplacers(maskReplacers) {
    var baseMaskReplacers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMaskReplacers;

    if (maskReplacers === null || Array.isArray(maskReplacers) || _typeof(maskReplacers) !== 'object') {
      return baseMaskReplacers;
    }

    return Object.keys(maskReplacers).reduce(function (extendedMaskReplacers, key) {
      var value = maskReplacers[key];

      if (value !== null && !(value instanceof RegExp)) {
        return extendedMaskReplacers;
      }

      return _objectSpread2(_objectSpread2({}, extendedMaskReplacers), {}, _defineProperty({}, key, value));
    }, baseMaskReplacers);
  }

  var options = createOptions();

  function triggerInputUpdate(el) {
    trigger(el, 'input');
  }

  function updateValue(el) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var value = el.value;

    var _options$get = options.get(el),
        previousValue = _options$get.previousValue,
        mask = _options$get.mask;

    var isValueChanged = value !== previousValue;
    var isLengthIncreased = value.length > previousValue.length;
    var isUpdateNeeded = value && isValueChanged && isLengthIncreased;

    if ((force || isUpdateNeeded) && mask) {
      var _conformToMask = conformToMask(value, mask, {
        guide: false
      }),
          conformedValue = _conformToMask.conformedValue;

      el.value = conformedValue;
      triggerInputUpdate(el);
    }

    options.partiallyUpdate(el, {
      previousValue: value
    });
  }

  function updateMask(el, inputMask, maskReplacers) {
    var mask = parseMask(inputMask, maskReplacers);
    options.partiallyUpdate(el, {
      mask: mask
    });
  }

  function maskToString(mask) {
    var maskArray = Array.isArray(mask) ? mask : [mask];
    var filteredMaskArray = maskArray.filter(function (part) {
      return isString(part) || isRegexp(part);
    });
    return filteredMaskArray.toString();
  }

  function createDirective() {
    var directiveOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instanceMaskReplacers = extendMaskReplacers(directiveOptions && directiveOptions.placeholders);
    return {
      bind: function bind(el, _ref) {
        var value = _ref.value;
        el = queryInputElementInside(el);
        updateMask(el, value, instanceMaskReplacers);
        updateValue(el);
      },
      componentUpdated: function componentUpdated(el, _ref2) {
        var value = _ref2.value,
            oldValue = _ref2.oldValue;
        el = queryInputElementInside(el);
        var isMaskChanged = isFunction(value) || maskToString(oldValue) !== maskToString(value);

        if (isMaskChanged) {
          updateMask(el, value, instanceMaskReplacers);
        }

        updateValue(el, isMaskChanged);
      },
      unbind: function unbind(el) {
        el = queryInputElementInside(el);
        options.remove(el);
      }
    };
  }
  var directive = createDirective();

  function createFilter() {
    var filterOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instanceMaskReplacers = extendMaskReplacers(filterOptions && filterOptions.placeholders);
    return function (value, inputMask) {
      if (!isString(value) && !Number.isFinite(value)) { return value; }
      var mask = parseMask(inputMask, instanceMaskReplacers);

      var _conformToMask = conformToMask("".concat(value), mask, {
        guide: false
      }),
          conformedValue = _conformToMask.conformedValue;

      return conformedValue;
    };
  }
  createFilter();

  Vue__default["default"].use(Vuex__default["default"]);

  var backupStore = new Vuex__default["default"].Store({});

  var state = {
    config: null, // package init configuration
    error: null, // error from last operation

    current_user: null, // current user

    text_confirmation: null, // log in by phone text
    sign_by_phone_step: 1, // sign in by phone step

    tab: false,
    is_loading: false,
    is_session_persistant: true,
    is_login_with_phone_shown: false,
    is_authguard_dialog_shown: true, // login dialog
    is_authguard_dialog_persistent: true, // login dialog persistent option
    is_email_verification_link_sent: false, // email verification confirmation
    is_email_reset_password_link_sent: false, // confirmation for successful reset password link email
    is_email_verification_screen_shown: false, // show email verification screen,
    is_reset_password_screen_shown: false, // show reset password screen,
    is_route_public: false, // is current route public
    is_from_public_to_auth: false, // is route going from public page to protected
  };

  var getters = {
    getError: function getError(state) {
      return state.error
    },
    getSessionPersistence: function getSessionPersistence(state) {
      return state.is_session_persistant
    },
    getCurrentUser: function getCurrentUser(state) {
      return state.current_user
    },
    getUid: function getUid(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user && user.uid : null
    },
    getDisplayName: function getDisplayName(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.displayName : null
    },
    getEmail: function getEmail(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.email : null
    },
    getPhotoURL: function getPhotoURL(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.photoURL : null
    },
    getPhoneNumber: function getPhoneNumber(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.phoneNumber : null
    },
    getMetadata: function getMetadata(state, getters) {
      var user = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp).currentUser;
      return user ? user.metadata : null
    },
    isLoading: function isLoading(state) {
      return state.is_loading
    },
    isAuthenticated: function isAuthenticated(state, getters) {
      var user = getters.getCurrentUser;
      return user ? true : false
    },
    isAnonymous: function isAnonymous(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.isAnonymous : null
    },
    isVerified: function isVerified(state, getters) {
      var user = getters.getCurrentUser;
      return user ? user.emailVerified : null
    },
    isRoutePublic: function isRoutePublic(state) {
      return state.is_route_public
    },
    isFromPublicToAuth: function isFromPublicToAuth(state) {
      return state.is_from_public_to_auth
    },
    isAuthGuardDialogShown: function isAuthGuardDialogShown(state) {
      return state.is_authguard_dialog_shown
    },
    isAuthGuardDialogPersistent: function isAuthGuardDialogPersistent(state) {
      return state.is_authguard_dialog_persistent
    },
    isUserRegistrationAllowed: function isUserRegistrationAllowed(state) {
      return state.config.registration
    },
    isEmailVerificationRequired: function isEmailVerificationRequired(state) {
      return state.config.verification
    },
    isEmailVerificationScrenShown: function isEmailVerificationScrenShown(state) {
      return state.is_email_verification_screen_shown
    },
    isEmailVerificationLinkSent: function isEmailVerificationLinkSent(state) {
      return state.is_email_verification_link_sent
    },
    isEmailResetPasswordLinkSent: function isEmailResetPasswordLinkSent(state) {
      return state.is_email_reset_password_link_sent
    },
    isResetPasswordScreenShown: function isResetPasswordScreenShown(state) {
      return state.is_reset_password_screen_shown
    },
    isLoginWithPhoneShown: function isLoginWithPhoneShown(state) {
      return state.is_login_with_phone_shown
    },
    isLoginWithProvidersActive: function isLoginWithProvidersActive(state) {
      return state.config.google || state.config.facebook || state.config.phone || state.config.saml
    },
    isOnlySingleProvider: function isOnlySingleProvider(state) {
      var cc = 0;
      var check = ["google", "facebook", "phone", "saml"];

      check.forEach(function (c) {
        if (state.config[c] === true) { cc++; }
      });

      // to render large button instead icon
      return cc === 1
    },
  };

  var debug = function () {
    var text = [], len = arguments.length;
    while ( len-- ) text[ len ] = arguments[ len ];

    var debug = Vue__default["default"].prototype.$authGuardDebug;

    if (!Boolean(debug)) { return }

    console.log.apply(console, text);
  };

  function authCheck () {
    debug("[ auth check ]: execution started...");

    var allowRoute = false; // default state

    var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);
    var store = Vue__default["default"].prototype.$authGuardStore;
    var currentUser = auth$1.currentUser;
    var isAuthenticated = currentUser ? true : false;
    var verification = store.state.auth.config.verification;
    var isRoutePublic = store.getters["auth/isRoutePublic"];
    var fromPublicToAuth = store.getters["auth/isFromPublicToAuth"];
    if (verification) { debug("[ auth check ]: email verification required: [", verification, "]"); }

    // anonymous authenticated currentUser
    if (verification && currentUser && currentUser.isAnonymous) {
      debug("[ auth check ]: anonymous user BLOCKED unable to verify email!");

      store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", true);
      store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
    }

    // not show login dialog if page is public
    else if (isRoutePublic) {
      allowRoute = true;
      store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", false);
      store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
    } else if (!isRoutePublic && fromPublicToAuth && !isAuthenticated) {
      store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", true);
      store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
    }

    // authenticated currentUser
    else if (isAuthenticated) {
      debug("[ auth check ]: authenticated currentUser ID: [", currentUser.uid, "]");

      var emailVerified = currentUser.emailVerified || false;
      var domain = currentUser.email ? currentUser.email.split("@")[1] : "";

      debug("[ auth check ]: user email verified: [", emailVerified, "]");

      // check if to show dialog
      allowRoute = emailVerified;

      // check if email verification is always required or for some specific email domain(s) only
      if (verification === false) {
        debug("[ auth check ]: authguard config does not require email verification");

        allowRoute = true;
      } else if (Array.isArray(verification) && !verification.includes(domain)) {
        debug(
          "[ auth check ]: user email domain: [",
          domain,
          "] not included on domain list that requires email verification to authenticate:",
          verification
        );

        allowRoute = true;
      } else {
        debug("[ auth check ]: authguard config requires email verification");
        store.commit("auth/SET_EMAIL_VERIFICATION_SCREEN_SHOWN", true);
      }

      if (allowRoute) {
        store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", false);
        store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
      } else {
        store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", true);
        if (fromPublicToAuth) {
          store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
        } else { store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", true); }
      }
    }

    // not authenticated currentUsers get persistent login dialog
    else {
      debug("[ auth check ]: currentUser is NOT authenticated");

      store.commit("auth/SET_AUTH_GUARD_DIALOG_SHOWN", true);
      store.commit("auth/SET_AUTH_GUARD_DIALOG_PERSISTENT", true); // added v0.5.6 because on log out the dialog was not persistent
    }

    debug("[ auth check ]: is route ALLOWED: [", allowRoute, "]");

    return allowRoute
  }

  var actions = {
    authGuardOnRouterReady: function authGuardOnRouterReady(ref) {
      var getters = ref.getters;
      var commit = ref.commit;

      var debug = Vue__default["default"].prototype.$authGuardDebug;
      var router = Vue__default["default"].prototype.$authGuardRouter;
      var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

      if (debug) { console.log("[ auth guard ]: revalidate when vue router ready"); }

      // check current route when router is ready
      router.onReady(function () {
        var isAuthenticated = auth$1.currentUser ? true : false;
        var isCurrentRoutePublic = getters.isRoutePublic;

        if (debug) {
          console.log(
            "[ auth guard ]: vue router READY! isCurrentRoutePublic: [",
            isCurrentRoutePublic,
            "] isAuthenticated: [",
            isAuthenticated,
            "]"
          );
        }

        if (isCurrentRoutePublic) {
          commit("SET_AUTH_GUARD_DIALOG_SHOWN", false);
          commit("SET_AUTH_GUARD_DIALOG_PERSISTENT", false);
        } else if (!isAuthenticated) {
          commit("SET_AUTH_GUARD_DIALOG_SHOWN", true);
          commit("SET_AUTH_GUARD_DIALOG_PERSISTENT", true);
        }
      });
    },

    //
    initializeGuard: function initializeGuard(ref) {
      var state = ref.state;
      var commit = ref.commit;
      var dispatch = ref.dispatch;

      var config = state.config;
      var debug = Vue__default["default"].prototype.$authGuardDebug;
      var user = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp).currentUser;

      if (user) {
        var uid = user.uid;
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var isAnonymous = user.isAnonymous;
        var phoneNumber = user.phoneNumber;
        var photoURL = user.photoURL;
        var currentUser = { uid: uid, displayName: displayName, email: email, emailVerified: emailVerified, isAnonymous: isAnonymous, phoneNumber: phoneNumber, photoURL: photoURL };
        commit("SET_CURRENT_USER", Object.assign({}, currentUser));
      } else { commit("SET_CURRENT_USER", null); }

      if (debug) { console.log("[ auth guard ]: component initialized for user: [", user ? user.uid : null, "]"); }

      commit("SET_CONFIG", null); // have to commit null to make firebase auth reactive
      commit("SET_CONFIG", config);
      commit("SET_EMAIL_VERIFICATION_SCREEN_SHOWN", false);

      authCheck();

      dispatch("authGuardOnRouterReady"); // revalidate auth guard for vue router
    },

    //
    loginWithEmail: function loginWithEmail(ref, ref$1) {
      ref.state;
      var commit = ref.commit;
      var email = ref$1.email;
      var password = ref$1.password;

      return new Promise(async function (resolve, reject) {
        try {
          var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);
          var router = Vue__default["default"].prototype.$authGuardRouter;

          commit("SET_LOADING", true);

          await auth.signOut(auth$1);

          // set session persistence
          if (Vue__default["default"].prototype.$authGuardSession === "browser") {
            await auth.setPersistence(auth$1, auth.browserSessionPersistence);
          } else {
            await auth.setPersistence(auth$1, auth.browserLocalPersistence);
          }

          await auth.signInWithEmailAndPassword(auth$1, email, password);

          // this is needed to reload route that was not loaded if user was not authenticated
          if (router.currentRoute.name === null) { router.push(router.currentRoute.path).catch(function () {}); }

          commit("SET_LOADING", false);

          return resolve()
        } catch (error) {
          commit("SET_ERROR", error);
          commit("SET_LOADING", false);

          return reject()
        }
      })
    },

    //
    loginWithGoogle: function loginWithGoogle(ref) {
      ref.state;

      var provider = new auth.GoogleAuthProvider();
      var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

      // useDeviceLanguage(auth)
      auth.signInWithRedirect(auth$1, provider);
    },

    //
    loginWithFacebook: function loginWithFacebook(ref) {
      ref.state;

      var provider = new auth.FacebookAuthProvider();
      var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

      // useDeviceLanguage(auth)
      auth.signInWithRedirect(auth$1, provider);
    },

    //
    loginWithPhone: function loginWithPhone(ref) {
      ref.state;
  },

    loginWithSaml: function loginWithSaml(ref) {
      var state = ref.state;

      var provider = new auth.SAMLAuthProvider(state.config.saml_provider_id);
      var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

      auth.signInWithRedirect(auth$1, provider);
    },

    //
    textPhoneVerificationCode: async function textPhoneVerificationCode(ref, ref$1) {
      ref.state;
      var commit = ref.commit;
      var phoneNumber = ref$1.phoneNumber;
      var recaptchaVerifier = ref$1.recaptchaVerifier;

      try {
        commit("SET_LOADING", true);
        commit("SET_PHONE_TEXT_CONFIRMATION", null);

        var phone = "+1" + phoneNumber.replace(/\D/g, "");
        var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);
        var confirmationResult = await signInWithPhoneNumber(auth$1, phone, recaptchaVerifier);

        commit("SET_LOADING", false);
        commit("SET_SIGN_BY_PHONE_STEP", 2);
        commit("SET_PHONE_TEXT_CONFIRMATION", confirmationResult);
      } catch (error) {
        commit("SET_ERROR", error);
        commit("SET_LOADING", false);
      }
    },

    //
    confirmCode: async function confirmCode(ref, confirmationCode) {
      var state = ref.state;
      var commit = ref.commit;

      try {
        commit("SET_LOADING", true);

        console.log("confirmationCode", confirmationCode.join());

        await state.text_confirmation.confirm(confirmationCode.join());

        commit("SET_LOADING", false);
        commit("SET_SIGN_BY_PHONE_STEP", 1);
      } catch (error) {
        commit("SET_ERROR", error);
        commit("SET_LOADING", false);
        commit("SET_SIGN_BY_PHONE_STEP", 1);
      }
    },

    //
    registerUser: async function registerUser(ref, ref$1) {
      var state = ref.state;
      var commit = ref.commit;
      var displayName = ref$1.displayName;
      var email = ref$1.email;
      var password = ref$1.password;

      try {
        commit("SET_LOADING", true);

        var verification = state.config.email;
        var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

        await auth.createUserWithEmailAndPassword(auth$1, email, password);
        await auth.signInWithEmailAndPassword(auth$1, email, password);
        await auth.updateProfile(auth$1.currentUser, { displayName: displayName });

        // send email to verify user email address if config option is not set to false
        if (verification === true || (Array.isArray(verification) && verification.includes(domain))) {
          await auth.sendEmailVerification(auth$1.currentUser);
        }

        commit("SET_LOADING", false);
      } catch (error) {
        commit("SET_ERROR", error);
        commit("SET_LOADING", false);
      }
    },

    emailPasswordResetLink: async function emailPasswordResetLink(ref, email) {
      ref.state;
      var commit = ref.commit;

      try {
        commit("SET_LOADING", true);

        var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

        await auth.sendPasswordResetEmail(auth$1, email);

        commit("SET_ERROR", false);
        commit("SET_LOADING", false);
        commit("SET_EMAIL_PASSWORD_RESET_LINK_SENT", true);
      } catch (error) {
        commit("SET_ERROR", error);
        commit("SET_LOADING", false);
      }
    },

    //
    signOut: function signOut$1(ref) {
      ref.state;

      var debug = Vue__default["default"].prototype.$authGuardDebug;
      var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

      if (debug) { console.log("[ auth guard ]: signOut request"); }

      return auth.signOut(auth$1)
    },

    //
    sendVerificationEmail: function sendVerificationEmail(ref) {
      ref.state;
      var commit = ref.commit;

      return new Promise(async function (resolve, reject) {
        try {
          commit("SET_LOADING", true);

          var auth$1 = auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp);

          await auth.sendEmailVerification(auth$1.currentUser);

          commit("SET_LOADING", false);
          commit("SET_EMAIL_VERIFICATION_LINK_SENT", true);

          return resolve()
        } catch (error) {
          commit("SET_ERROR", error);
          commit("SET_LOADING", false);

          return reject()
        }
      })
    },
  };

  var mutations = {
    SET_TAB: function (state, index) { return (state.tab = index); },
    SET_ERROR: function (state, error) { return (state.error = error); },
    SET_CONFIG: function (state, config) { return (state.config = config); },
    SET_LOADING: function (state, status) { return (state.is_login = status); },
    SET_CURRENT_USER: function (state, user) { return (state.current_user = user); },
    SET_SIGN_BY_PHONE_STEP: function (state, step) { return (state.sign_by_phone_step = step); },
    SET_SESSION_PERSISTANCE: function (state, status) { return (state.is_session_persistant = status); },
    SET_IS_ROUTE_PUBLIC: function (state, status) { return (state.is_route_public = status); },
    SET_IS_FROM_PUBLIC_TO_AUTH: function (state, status) { return (state.is_from_public_to_auth = status); },
    SET_AUTH_GUARD_DIALOG_SHOWN: function (state, status) { return (state.is_authguard_dialog_shown = status); },
    SET_PHONE_TEXT_CONFIRMATION: function (state, confirmation) { return (state.text_confirmation = confirmation); },
    SET_AUTH_GUARD_DIALOG_PERSISTENT: function (state, status) { return (state.is_authguard_dialog_persistent = status); },
    SET_EMAIL_VERIFICATION_LINK_SENT: function (state, status) { return (state.is_email_verification_link_sent = status); },
    SET_EMAIL_PASSWORD_RESET_LINK_SENT: function (state, status) { return (state.is_email_reset_password_link_sent = status); },
    SET_EMAIL_VERIFICATION_SCREEN_SHOWN: function (state, status) {
      state.is_email_verification_screen_shown = status;

      if (status === false) { state.error = null; }
    },
    SET_PASSWORD_RESET_SCREEN_SHOWN: function (state, status) {
      state.tab = status ? 1 : 0;
      state.is_reset_password_screen_shown = status;

      if (status === false) { state.is_email_reset_password_link_sent = false; }
    },
    SET_SHOW_LOGIN_WITH_PHONE: function (state, status) {
      state.tab = 0; // reset tab to Sign In
      state.is_login_with_phone_shown = status;

      if (status === false) { state.sign_by_phone_step = 1; } // reset sign by phone step
    },
  };

  var AuthStore = {
    namespaced: true,

    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
  };

  var defaultSettings = {
    debug: false,
    store: null, // vuex store
    router: null, // routes
    firebase: null, // pass on firebase middleware app init

    saml: false, // allow authentication with saml
    saml_text: "Login with SAML", // saml button text
    saml_provider_id: "saml.okta", // saml provider id

    email: true, // allow authentication with email
    phone: false, // allow authentication with phone
    google: false, // allow authentication with gmail account
    facebook: false, // allow authentication with facebook account

    title: "Authenticate",
    subtitle: "Firebase Vuetify Authentication NPM package",

    icon: "mdi-brightness-7", // authentication prompt icon
    iconColor: "orange", // authentication prompt icon color

    verification: false, // require user email to be verified before granting access
    registration: true, // allow new user registrations
  };

  var script$7 = {
    components: {
      VIcon: lib.VIcon,
      VListItemTitle: lib.VListItemTitle,
      VListItemSubtitle: lib.VListItemSubtitle,
      VListItemContent: lib.VListItemContent,
      VListItem: lib.VListItem,
      VList: lib.VList
    },

    computed: Object.assign({}, Vuex.mapState("auth", ["config"]))
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  var __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-list",
      { attrs: { dense: "" } },
      [
        _c(
          "v-list-item",
          [
            _c(
              "v-list-item-content",
              [
                _c(
                  "v-list-item-title",
                  { staticClass: "title" },
                  [
                    _c("v-icon", { attrs: { color: _vm.config.iconColor } }, [
                      _vm._v(_vm._s(_vm.config.icon)) ]),
                    _vm._v(
                      "\n\n        " + _vm._s(_vm.config.title) + "\n      "
                    ) ],
                  1
                ),
                _vm._v(" "),
                _c("v-list-item-subtitle", [
                  _c("div", { staticClass: "ml-1" }, [
                    _vm._v(
                      "\n          " + _vm._s(_vm.config.subtitle) + "\n        "
                    ) ]) ]) ],
              1
            ) ],
          1
        ) ],
      1
    )
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    var __vue_inject_styles__$7 = undefined;
    /* scoped */
    var __vue_scope_id__$7 = undefined;
    /* module identifier */
    var __vue_module_identifier__$7 = undefined;
    /* functional template */
    var __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$7 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$6 = {
    components: {
      Branding: __vue_component__$7,
      VAlert: lib.VAlert,
      VCard: lib.VCard,
      VTextField: lib.VTextField,
      VCheckbox: lib.VCheckbox,
      VCardText: lib.VCardText,
      VBtn: lib.VBtn,
      VCardActions: lib.VCardActions,
      VContainer: lib.VContainer
    },

    data: function () { return ({
      email: "",
      password: "",
      remember: true,
    }); },

    computed: Object.assign({}, Vuex.mapState("auth", ["config"]),
      Vuex.mapGetters("auth", ["getSessionPersistence", "isLoading", "getError"])),

    created: function created() {
      this.remember = this.getSessionPersistence;
      this.SET_EMAIL_PASSWORD_RESET_LINK_SENT(false);
    },

    methods: Object.assign({}, Vuex.mapActions("auth", ["loginWithEmail"]),
      Vuex.mapMutations("auth", [
        "SET_SESSION_PERSISTANCE",
        "SET_EMAIL_PASSWORD_RESET_LINK_SENT",
        "SET_PASSWORD_RESET_SCREEN_SHOWN",
        "SET_ERROR" ])),
  };

  /* script */
  var __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-container",
      [
        _c(
          "v-card",
          { attrs: { flat: "" } },
          [
            Boolean(_vm.getError)
              ? _c(
                  "v-alert",
                  {
                    attrs: { type: "error", dismissible: "" },
                    on: {
                      click: function ($event) {
                        return _vm.SET_ERROR(null)
                      },
                    },
                  },
                  [_vm._v("\n      " + _vm._s(_vm.getError.message) + "\n    ")]
                )
              : _c("branding", { staticClass: "text-center" }) ],
          1
        ),
        _vm._v(" "),
        _vm.config.email
          ? _c(
              "v-card",
              { attrs: { flat: "" } },
              [
                _c(
                  "v-card-text",
                  { staticClass: "mb-0 pb-0" },
                  [
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        required: "",
                        label: "Email",
                        "prepend-icon": "mdi-account",
                      },
                      model: {
                        value: _vm.email,
                        callback: function ($$v) {
                          _vm.email = $$v;
                        },
                        expression: "email",
                      },
                    }),
                    _vm._v(" "),
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        autocomplete: "off",
                        name: "password",
                        type: "password",
                        label: "Password",
                        "prepend-icon": "mdi-lock",
                      },
                      model: {
                        value: _vm.password,
                        callback: function ($$v) {
                          _vm.password = $$v;
                        },
                        expression: "password",
                      },
                    }),
                    _vm._v(" "),
                    _c("v-checkbox", {
                      staticClass: "ml-8",
                      attrs: {
                        dense: "",
                        name: "remember",
                        label: "remember me",
                      },
                      on: {
                        change: function ($event) {
                          return _vm.SET_SESSION_PERSISTANCE(_vm.remember)
                        },
                      },
                      model: {
                        value: _vm.remember,
                        callback: function ($$v) {
                          _vm.remember = $$v;
                        },
                        expression: "remember",
                      },
                    }) ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "text-center pb-4" },
                  [
                    _c(
                      "v-btn",
                      {
                        attrs: { text: "", "x-small": "", color: "primary" },
                        on: {
                          click: function ($event) {
                            return _vm.SET_PASSWORD_RESET_SCREEN_SHOWN(true)
                          },
                        },
                      },
                      [_vm._v(" Forgot Password? ")]
                    ) ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "v-card-actions",
                  [
                    _c(
                      "v-btn",
                      {
                        attrs: {
                          depressed: "",
                          block: "",
                          large: "",
                          color: "primary",
                          type: "submit",
                          disabled: _vm.email === "" || _vm.password === "",
                        },
                        on: {
                          click: function ($event) {
                            return _vm.loginWithEmail({
                              email: _vm.email,
                              password: _vm.password,
                            })
                          },
                        },
                      },
                      [_vm._v("\n        Login\n      ")]
                    ) ],
                  1
                ) ],
              1
            )
          : _vm._e() ],
      1
    )
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    var __vue_inject_styles__$6 = undefined;
    /* scoped */
    var __vue_scope_id__$6 = undefined;
    /* module identifier */
    var __vue_module_identifier__$6 = undefined;
    /* functional template */
    var __vue_is_functional_template__$6 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$6 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$5 = {
    components: {
      Branding: __vue_component__$7,
      VAlert: lib.VAlert,
      VTextField: lib.VTextField,
      VCardText: lib.VCardText,
      VBtn: lib.VBtn,
      VCardActions: lib.VCardActions,
      VForm: lib.VForm,
      VCard: lib.VCard,
      VContainer: lib.VContainer
    },

    data: function () { return ({
      email: "",
      password: "",
      confirm: "",
      displayName: "",
      valid: false,
    }); },

    computed: Object.assign({}, Vuex.mapGetters("auth", ["isLoading", "getError"]),

      {rules: function rules() {
        var validation = {
          email: this.email == "" ? "Email cannot be empty" : true,
          password: this.password == "" ? "Password cannot be empty" : true,
          displayName: this.displayName == "" ? "Name cannot be empty" : true,
          confirm: this.password !== this.confirm ? "Passwords do not match" : true,
        };

        return validation
      }}),

    methods: Object.assign({}, Vuex.mapActions("auth", ["registerUser"]),
      Vuex.mapMutations("auth", ["SET_ERROR"]),

      {register: function register() {
        var ref = this;
        var displayName = ref.displayName;
        var email = ref.email;
        var password = ref.password;
        if (this.$refs.form.validate()) { this.registerUser({ displayName: displayName, email: email, password: password }); }
      }}),
  };

  /* script */
  var __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-container",
      [
        _c(
          "v-card",
          { attrs: { flat: "" } },
          [
            _c(
              "v-form",
              {
                ref: "form",
                on: {
                  submit: function ($event) {
                    $event.preventDefault();
                    return _vm.register()
                  },
                },
                model: {
                  value: _vm.valid,
                  callback: function ($$v) {
                    _vm.valid = $$v;
                  },
                  expression: "valid",
                },
              },
              [
                Boolean(_vm.getError)
                  ? _c(
                      "v-alert",
                      {
                        attrs: { type: "error", dismissible: "" },
                        on: {
                          click: function ($event) {
                            return _vm.SET_ERROR(null)
                          },
                        },
                      },
                      [
                        _vm._v(
                          "\n        " + _vm._s(_vm.getError.message) + "\n      "
                        ) ]
                    )
                  : _c("branding", { staticClass: "text-center" }),
                _vm._v(" "),
                _c(
                  "v-card-text",
                  { staticClass: "mb-0 pb-0" },
                  [
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        required: "",
                        label: "Name",
                        "prepend-icon": "mdi-account",
                        rules: [_vm.rules.displayName],
                      },
                      model: {
                        value: _vm.displayName,
                        callback: function ($$v) {
                          _vm.displayName = $$v;
                        },
                        expression: "displayName",
                      },
                    }),
                    _vm._v(" "),
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        required: "",
                        label: "Email",
                        "prepend-icon": "mdi-email",
                        rules: [_vm.rules.email],
                      },
                      model: {
                        value: _vm.email,
                        callback: function ($$v) {
                          _vm.email = $$v;
                        },
                        expression: "email",
                      },
                    }),
                    _vm._v(" "),
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        autocomplete: "off",
                        required: "",
                        type: "password",
                        label: "Password",
                        "prepend-icon": "mdi-lock",
                        rules: [_vm.rules.password],
                      },
                      model: {
                        value: _vm.password,
                        callback: function ($$v) {
                          _vm.password = $$v;
                        },
                        expression: "password",
                      },
                    }),
                    _vm._v(" "),
                    _c("v-text-field", {
                      staticClass: "mr-2",
                      attrs: {
                        autocomplete: "off",
                        required: "",
                        type: "password",
                        label: "Confirm password",
                        "prepend-icon": "mdi-lock",
                        rules: [_vm.rules.confirm],
                      },
                      model: {
                        value: _vm.confirm,
                        callback: function ($$v) {
                          _vm.confirm = $$v;
                        },
                        expression: "confirm",
                      },
                    }) ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "v-card-actions",
                  [
                    _c(
                      "v-btn",
                      {
                        attrs: {
                          block: "",
                          large: "",
                          depressed: "",
                          color: "primary",
                          type: "submit",
                          disabled: !_vm.valid,
                        },
                      },
                      [_vm._v(" Register ")]
                    ) ],
                  1
                ) ],
              1
            ) ],
          1
        ) ],
      1
    )
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    var __vue_inject_styles__$5 = undefined;
    /* scoped */
    var __vue_scope_id__$5 = undefined;
    /* module identifier */
    var __vue_module_identifier__$5 = undefined;
    /* functional template */
    var __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$4 = {
    components: {
      Branding: __vue_component__$7,
      VAlert: lib.VAlert,
      VTextField: lib.VTextField,
      VCardText: lib.VCardText,
      VBtn: lib.VBtn,
      VCardActions: lib.VCardActions,
      VContainer: lib.VContainer,
      VForm: lib.VForm,
      VCard: lib.VCard
    },

    data: function () { return ({
      email: "",
      valid: false,
    }); },

    computed: Object.assign({}, Vuex.mapGetters("auth", ["isLoading", "getError", "isEmailResetPasswordLinkSent"]),

      {rules: function rules() {
        var validation = {
          email: this.email == "" ? "Email cannot be empty" : true,
        };

        return validation
      }}),

    methods: Object.assign({}, Vuex.mapActions("auth", ["emailPasswordResetLink"]),
      Vuex.mapMutations("auth", [
        "SET_TAB",
        "SET_ERROR",
        "SET_PASSWORD_RESET_SCREEN_SHOWN",
        "SET_EMAIL_PASSWORD_RESET_LINK_SENT" ])),
  };

  /* script */
  var __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-container",
      [
        _c(
          "v-card",
          { attrs: { flat: "" } },
          [
            _c(
              "v-form",
              {
                ref: "form",
                on: {
                  submit: function ($event) {
                    $event.preventDefault();
                    return _vm.emailPasswordResetLink(_vm.email)
                  },
                },
                model: {
                  value: _vm.valid,
                  callback: function ($$v) {
                    _vm.valid = $$v;
                  },
                  expression: "valid",
                },
              },
              [
                Boolean(_vm.getError)
                  ? _c(
                      "v-alert",
                      {
                        attrs: { type: "error", dismissible: "" },
                        on: {
                          click: function ($event) {
                            return _vm.SET_ERROR(null)
                          },
                        },
                      },
                      [
                        _vm._v(
                          "\n        " + _vm._s(_vm.getError.message) + "\n      "
                        ) ]
                    )
                  : _c("branding", { staticClass: "text-center" }),
                _vm._v(" "),
                !_vm.isEmailResetPasswordLinkSent
                  ? _c(
                      "div",
                      [
                        _c(
                          "v-card-text",
                          { staticClass: "mb-0 pb-0" },
                          [
                            _c("div", { staticClass: "mb-5" }, [
                              _vm._v(
                                "\n            Enter registered user email address and we will send you a link to reset your password.\n          "
                              ) ]),
                            _vm._v(" "),
                            _c("v-text-field", {
                              staticClass: "mr-2",
                              attrs: {
                                required: "",
                                error: Boolean(_vm.getError),
                                label: "Email",
                                "prepend-icon": "mdi-account",
                                rules: [_vm.rules.email],
                              },
                              model: {
                                value: _vm.email,
                                callback: function ($$v) {
                                  _vm.email = $$v;
                                },
                                expression: "email",
                              },
                            }) ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "v-card-actions",
                          [
                            _c(
                              "v-btn",
                              {
                                attrs: {
                                  block: "",
                                  large: "",
                                  depressed: "",
                                  color: "primary",
                                  type: "submit",
                                  disabled: _vm.isLoading,
                                },
                              },
                              [
                                _vm._v(
                                  "\n            Email Password Reset Link\n          "
                                ) ]
                            ) ],
                          1
                        ) ],
                      1
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.isEmailResetPasswordLinkSent
                  ? _c(
                      "v-container",
                      { staticClass: "pa-4 text-center" },
                      [
                        _c("v-card-text", { staticClass: "text-h5" }, [
                          _vm._v(" Email has been sent! ") ]),
                        _vm._v(" "),
                        _c("v-card-text", [
                          _vm._v(
                            "Please check your inbox and follow the instructions in the email to reset your account\n          password"
                          ) ]),
                        _vm._v(" "),
                        _c(
                          "v-card-actions",
                          [
                            _c(
                              "v-btn",
                              {
                                attrs: {
                                  block: "",
                                  large: "",
                                  depressed: "",
                                  color: "primary",
                                },
                                on: {
                                  click: function ($event) {
                                    return _vm.SET_PASSWORD_RESET_SCREEN_SHOWN(
                                      false
                                    )
                                  },
                                },
                              },
                              [_vm._v(" Login ")]
                            ) ],
                          1
                        ) ],
                      1
                    )
                  : _vm._e() ],
              1
            ) ],
          1
        ) ],
      1
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    var __vue_inject_styles__$4 = undefined;
    /* scoped */
    var __vue_scope_id__$4 = undefined;
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$3 = {
    components: {
      Branding: __vue_component__$7,
      VAlert: lib.VAlert,
      VTextField: lib.VTextField,
      VCardText: lib.VCardText,
      VBtn: lib.VBtn,
      VCardActions: lib.VCardActions,
      VForm: lib.VForm,
      VCol: lib.VCol,
      VRow: lib.VRow,
      VContainer: lib.VContainer,
      VCard: lib.VCard
    },

    data: function () { return ({
      valid: false,
      code: [], // text confirmation code
      digitMask: "#",
      phoneMask: "(###) ###-####",
      phoneNumber: "", // phone number field to send code to
      recaptchaVerifier: null,
      recaptchaWidgetId: null,
    }); },

    computed: Object.assign({}, Vuex.mapState("auth", ["config", "sign_by_phone_step"]),
      Vuex.mapGetters("auth", ["isLoading", "getError"]),

      // phone number validation
      {rules: function rules() {
        var validation = {
          phoneNumber: this.phoneNumber.replace(/\D/g, "") < 1000000000 ? "Please enter a valid US phone number" : true,
        };

        return validation
      }}),

    mounted: function mounted() {
      var this$1$1 = this;

      this.recaptchaVerifier = new auth.RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth.getAuth(Vue__default["default"].prototype.$authGuardFirebaseApp)
      );
      this.recaptchaVerifier.render().then(function (widgetId) { return (this$1$1.recaptchaWidgetId = widgetId); });

      // window.grecaptcha.reset(this.recaptchaWidgetId)

      // // Or, if you haven't stored the widget ID:
      // this.recaptchaVerifier.render().then(function (widgetId) {
      //   grecaptcha.reset(widgetId)
      // })
    },

    methods: Object.assign({}, Vuex.mapActions("auth", ["loginWithGoogle", "loginWithFacebook", "textPhoneVerificationCode", "confirmCode"]),
      Vuex.mapMutations("auth", ["SET_SHOW_LOGIN_WITH_PHONE", "SET_ERROR"]),

      // paste handler to allow confirmation code paste
      {onPaste: function onPaste(event) {
        var text = event.clipboardData.getData("text").substr(0, 6);

        for (var index = 0; index < text.length; index++) {
          this.$set(this.code, index, text[index]);
        }
      },

      // form field focus handler to automatically move cursor to the next field
      nextElementFocus: function nextElementFocus(index, event) {
        var i = index;

        if (["Backspace", "ArrowLeft"].includes(event.key)) {
          i = index > 1 ? index - 1 : 0;
        }

        // jeez to figure this out OMG :)
        // https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ArrowRight"].includes(event.key)) {
          this.$set(this.code, index, event.key);

          i = index > 4 ? index : index + 1;
        }

        var el = "code" + i;

        this.$refs[el][0].focus();
      }}),
  };

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-container",
      [
        _c("div", { attrs: { id: "recaptcha-container" } }),
        _vm._v(" "),
        _c(
          "v-card",
          { attrs: { flat: "" } },
          [
            Boolean(_vm.getError)
              ? _c(
                  "v-alert",
                  {
                    attrs: { type: "error", dismissible: "" },
                    on: {
                      click: function ($event) {
                        return _vm.SET_ERROR(null)
                      },
                    },
                  },
                  [_vm._v("\n      " + _vm._s(_vm.getError.message) + "\n    ")]
                )
              : _c("branding", { staticClass: "text-center" }),
            _vm._v(" "),
            _vm.sign_by_phone_step === 1
              ? _c(
                  "div",
                  [
                    _c(
                      "v-form",
                      {
                        ref: "form",
                        on: {
                          submit: function ($event) {
                            $event.preventDefault();
                            return _vm.textPhoneVerificationCode({
                              phoneNumber: _vm.phoneNumber,
                              recaptchaVerifier: _vm.recaptchaVerifier,
                            })
                          },
                        },
                        model: {
                          value: _vm.valid,
                          callback: function ($$v) {
                            _vm.valid = $$v;
                          },
                          expression: "valid",
                        },
                      },
                      [
                        _c(
                          "v-card-text",
                          [
                            _c("v-text-field", {
                              directives: [
                                {
                                  name: "mask",
                                  rawName: "v-mask",
                                  value: _vm.phoneMask,
                                  expression: "phoneMask",
                                } ],
                              staticClass: "mx-15 px-5 large-font",
                              attrs: {
                                autocomplete: "off",
                                label: "Phone Number",
                                "prepend-icon": "mdi-cellphone",
                                prefix: "+1",
                                rules: [_vm.rules.phoneNumber],
                              },
                              model: {
                                value: _vm.phoneNumber,
                                callback: function ($$v) {
                                  _vm.phoneNumber = $$v;
                                },
                                expression: "phoneNumber",
                              },
                            }) ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "v-card-actions",
                          [
                            _c(
                              "v-btn",
                              {
                                attrs: {
                                  color: "primary",
                                  block: "",
                                  large: "",
                                  depressed: "",
                                  disabled: !_vm.valid,
                                  type: "submit",
                                },
                              },
                              [_vm._v(" Send Code ")]
                            ) ],
                          1
                        ) ],
                      1
                    ) ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.sign_by_phone_step === 2
              ? _c(
                  "v-container",
                  [
                    _c("p", { staticClass: "text-center" }, [
                      _vm._v("\n        enter confirmation code"),
                      _c("br"),
                      _vm._v(
                        "\n        you have recived on your mobile phone\n      "
                      ) ]),
                    _vm._v(" "),
                    _c(
                      "v-row",
                      { staticClass: "centered-input" },
                      _vm._l(6, function (element, index) {
                        return _c(
                          "v-col",
                          { key: index, attrs: { cols: "2" } },
                          [
                            _c("v-text-field", {
                              directives: [
                                {
                                  name: "mask",
                                  rawName: "v-mask",
                                  value: _vm.digitMask,
                                  expression: "digitMask",
                                } ],
                              key: index,
                              ref: "code" + index,
                              refInFor: true,
                              attrs: {
                                value: _vm.code[index],
                                "item-value": _vm.code[index],
                                "item-text": _vm.code[index],
                                outlined: "",
                                maxlength: "1",
                              },
                              on: {
                                keyup: function ($event) {
                                  return _vm.nextElementFocus(index, $event)
                                },
                                paste: _vm.onPaste,
                              },
                              model: {
                                value: _vm.code[index],
                                callback: function ($$v) {
                                  _vm.$set(_vm.code, index, $$v);
                                },
                                expression: "code[index]",
                              },
                            }) ],
                          1
                        )
                      }),
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "v-btn",
                      {
                        attrs: {
                          color: "primary",
                          block: "",
                          large: "",
                          depressed: "",
                          disabled: _vm.code.length < 6,
                        },
                        on: {
                          click: function ($event) {
                            return _vm.confirmCode(_vm.code)
                          },
                        },
                      },
                      [_vm._v("\n        Confirm Code\n      ")]
                    ) ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _c(
              "v-container",
              { staticClass: "text-center" },
              [
                _c(
                  "v-btn",
                  {
                    attrs: { text: "", "x-small": "", color: "primary" },
                    on: {
                      click: function ($event) {
                        return _vm.SET_SHOW_LOGIN_WITH_PHONE(false)
                      },
                    },
                  },
                  [_vm._v(" Sign In with email ")]
                ) ],
              1
            ) ],
          1
        ) ],
      1
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$3 = function (inject) {
      if (!inject) { return }
      inject("data-v-62c98517_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* styles for phone number field */\n.large-font[data-v-62c98517] input {\n  font-size: 1.5rem;\n}\n\n/* styles for confirmation code form fields */\n.centered-input[data-v-62c98517] input {\n  text-align: center;\n  font-weight: bold;\n  font-size: 1.5rem;\n}\n", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/firebase-vuetify-auth/src/components/LoginWithPhone.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAqKA,kCAAA;AACA;EACA,iBAAA;AACA;;AAEA,6CAAA;AACA;EACA,kBAAA;EACA,iBAAA;EACA,iBAAA;AACA","file":"LoginWithPhone.vue","sourcesContent":["<template>\n  <v-container>\n    <!-- recaptcha container needed for authenticating with the phone provider -->\n    <div id=\"recaptcha-container\" />\n\n    <!-- phone authentication provider: enter phone number -->\n    <v-card flat>\n      <!-- error alerts -->\n      <v-alert v-if=\"Boolean(getError)\" type=\"error\" dismissible @click=\"SET_ERROR(null)\">\n        {{ getError.message }}\n      </v-alert>\n\n      <!-- application branding -->\n      <branding v-else class=\"text-center\" />\n\n      <!-- send code by text to phone -->\n      <div v-if=\"sign_by_phone_step === 1\">\n        <v-form\n          ref=\"form\"\n          v-model=\"valid\"\n          @submit.prevent=\"textPhoneVerificationCode({ phoneNumber, recaptchaVerifier })\"\n        >\n          <v-card-text>\n            <v-text-field\n              v-model=\"phoneNumber\"\n              v-mask=\"phoneMask\"\n              class=\"mx-15 px-5 large-font\"\n              autocomplete=\"off\"\n              label=\"Phone Number\"\n              prepend-icon=\"mdi-cellphone\"\n              prefix=\"+1\"\n              :rules=\"[rules.phoneNumber]\"\n            />\n          </v-card-text>\n\n          <v-card-actions>\n            <v-btn color=\"primary\" block large depressed :disabled=\"!valid\" type=\"submit\"> Send Code </v-btn>\n          </v-card-actions>\n        </v-form>\n      </div>\n\n      <!-- confirm code received by phone text -->\n      <v-container v-if=\"sign_by_phone_step === 2\">\n        <p class=\"text-center\">\n          enter confirmation code<br />\n          you have recived on your mobile phone\n        </p>\n\n        <v-row class=\"centered-input\">\n          <v-col v-for=\"(element, index) in 6\" :key=\"index\" cols=\"2\">\n            <v-text-field\n              :ref=\"'code' + index\"\n              :key=\"index\"\n              v-model=\"code[index]\"\n              v-mask=\"digitMask\"\n              :value=\"code[index]\"\n              :item-value=\"code[index]\"\n              :item-text=\"code[index]\"\n              outlined\n              maxlength=\"1\"\n              @keyup=\"nextElementFocus(index, $event)\"\n              @paste=\"onPaste\"\n            />\n          </v-col>\n        </v-row>\n\n        <v-btn color=\"primary\" block large depressed :disabled=\"code.length < 6\" @click=\"confirmCode(code)\">\n          Confirm Code\n        </v-btn>\n      </v-container>\n\n      <v-container class=\"text-center\">\n        <v-btn text x-small color=\"primary\" @click=\"SET_SHOW_LOGIN_WITH_PHONE(false)\"> Sign In with email </v-btn>\n      </v-container>\n    </v-card>\n  </v-container>\n</template>\n\n<script>\nimport Vue from \"vue\"\nimport Branding from \"./Branding.vue\"\nimport { getAuth, RecaptchaVerifier } from \"firebase/auth\"\nimport { mapState, mapGetters, mapMutations, mapActions } from \"vuex\"\n\nexport default {\n  components: { Branding },\n\n  data: () => ({\n    valid: false,\n    code: [], // text confirmation code\n    digitMask: \"#\",\n    phoneMask: \"(###) ###-####\",\n    phoneNumber: \"\", // phone number field to send code to\n    recaptchaVerifier: null,\n    recaptchaWidgetId: null,\n  }),\n\n  computed: {\n    ...mapState(\"auth\", [\"config\", \"sign_by_phone_step\"]),\n    ...mapGetters(\"auth\", [\"isLoading\", \"getError\"]),\n\n    // phone number validation\n    rules() {\n      const validation = {\n        phoneNumber: this.phoneNumber.replace(/\\D/g, \"\") < 1000000000 ? \"Please enter a valid US phone number\" : true,\n      }\n\n      return validation\n    },\n  },\n\n  mounted() {\n    this.recaptchaVerifier = new RecaptchaVerifier(\n      \"recaptcha-container\",\n      { size: \"invisible\" },\n      getAuth(Vue.prototype.$authGuardFirebaseApp)\n    )\n    this.recaptchaVerifier.render().then((widgetId) => (this.recaptchaWidgetId = widgetId))\n\n    // window.grecaptcha.reset(this.recaptchaWidgetId)\n\n    // // Or, if you haven't stored the widget ID:\n    // this.recaptchaVerifier.render().then(function (widgetId) {\n    //   grecaptcha.reset(widgetId)\n    // })\n  },\n\n  methods: {\n    ...mapActions(\"auth\", [\"loginWithGoogle\", \"loginWithFacebook\", \"textPhoneVerificationCode\", \"confirmCode\"]),\n    ...mapMutations(\"auth\", [\"SET_SHOW_LOGIN_WITH_PHONE\", \"SET_ERROR\"]),\n\n    // paste handler to allow confirmation code paste\n    onPaste(event) {\n      const text = event.clipboardData.getData(\"text\").substr(0, 6)\n\n      for (var index = 0; index < text.length; index++) {\n        this.$set(this.code, index, text[index])\n      }\n    },\n\n    // form field focus handler to automatically move cursor to the next field\n    nextElementFocus(index, event) {\n      let i = index\n\n      if ([\"Backspace\", \"ArrowLeft\"].includes(event.key)) {\n        i = index > 1 ? index - 1 : 0\n      }\n\n      // jeez to figure this out OMG :)\n      // https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array\n      if ([\"0\", \"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\", \"ArrowRight\"].includes(event.key)) {\n        this.$set(this.code, index, event.key)\n\n        i = index > 4 ? index : index + 1\n      }\n\n      const el = \"code\" + i\n\n      this.$refs[el][0].focus()\n    },\n  },\n}\n</script>\n\n<style scoped>\n/* styles for phone number field */\n.large-font >>> input {\n  font-size: 1.5rem;\n}\n\n/* styles for confirmation code form fields */\n.centered-input >>> input {\n  text-align: center;\n  font-weight: bold;\n  font-size: 1.5rem;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$3 = "data-v-62c98517";
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      createInjector,
      undefined,
      undefined
    );

  var script$2 = {
    components: {
      VAlert: lib.VAlert,
      VBtn: lib.VBtn,
      VIcon: lib.VIcon,
      VContainer: lib.VContainer,
      VCard: lib.VCard
    },

    computed: Object.assign({}, Vuex.mapState("auth", ["config"]),
      Vuex.mapGetters("auth", [
        "getError",
        "isLoading",
        "isAuthenticated",
        "isEmailResetPasswordLinkSent",
        "isEmailVerificationLinkSent" ])),

    methods: Object.assign({}, Vuex.mapActions("auth", ["signIn", "signOut", "sendVerificationEmail"]),
      Vuex.mapMutations("auth", ["SET_EMAIL_VERIFICATION_SCREEN_SHOWN"]))
  };

  /* script */
  var __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-container",
      [
        _c("v-card", { staticClass: "text-center pa-5", attrs: { flat: "" } }, [
          _vm.getError
            ? _c(
                "div",
                [
                  _c("div", { staticClass: "display-1 grey--text mb-3" }, [
                    _vm._v("Error!") ]),
                  _vm._v(" "),
                  Boolean(_vm.getError)
                    ? _c(
                        "v-alert",
                        {
                          attrs: { type: "error", dismissible: "" },
                          on: {
                            click: function ($event) {
                              return _vm.SET_ERROR(null)
                            },
                          },
                        },
                        [
                          _vm._v(
                            "\n        " +
                              _vm._s(_vm.getError.message) +
                              "\n      "
                          ) ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      attrs: { color: "primary" },
                      on: {
                        click: function ($event) {
                          return _vm.SET_EMAIL_VERIFICATION_SCREEN_SHOWN(false)
                        },
                      },
                    },
                    [_vm._v(" Back to Login ")]
                  ) ],
                1
              )
            : _c(
                "div",
                [
                  !_vm.isEmailVerificationLinkSent
                    ? _c(
                        "div",
                        [
                          _c(
                            "div",
                            { staticClass: "display-1 grey--text mb-3" },
                            [_vm._v("Verification Required")]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-icon",
                            {
                              staticClass: "ma-4",
                              attrs: { size: "100", color: "grey" },
                            },
                            [_vm._v("mdi-account")]
                          ) ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.isEmailVerificationLinkSent
                    ? _c(
                        "div",
                        [
                          _c(
                            "div",
                            { staticClass: "display-1 grey--text mb-3" },
                            [_vm._v("Email sent!")]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-icon",
                            {
                              staticClass: "ma-4",
                              attrs: { size: "100", color: "grey" },
                            },
                            [_vm._v("mdi-email")]
                          ) ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "grey--text text--darken-2 mb-7 body-2" },
                    [
                      _c("p", [
                        _vm._v(
                          "\n          Please check your email to verify your address. Click at the link in the email we've sent you to confirm\n          your account access.\n        "
                        ) ]) ]
                  ),
                  _vm._v(" "),
                  !_vm.isEmailResetPasswordLinkSent
                    ? _c(
                        "div",
                        [
                          _c(
                            "p",
                            {
                              staticClass:
                                "grey--text text--darken-2 mb-7 body-2",
                            },
                            [
                              _vm._v(
                                "\n          If you have not received verification email"
                              ),
                              _c("br"),
                              _vm._v("click at the button below.\n        ") ]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.isLoading,
                                color: "primary",
                              },
                              on: {
                                click: function ($event) {
                                  return _vm.sendVerificationEmail()
                                },
                              },
                            },
                            [
                              _vm._v(
                                "\n          Send Verification Email\n        "
                              ) ]
                          ) ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.isEmailResetPasswordLinkSent
                    ? _c(
                        "div",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { color: "primary" },
                              on: {
                                click: function ($event) {
                                  return _vm.SET_EMAIL_VERIFICATION_SCREEN_SHOWN(
                                    false
                                  )
                                },
                              },
                            },
                            [_vm._v(" Back to Login ")]
                          ) ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "v-container",
                    [
                      _c("div", { staticClass: "caption mb-2" }, [
                        _vm._v("- or -") ]),
                      _vm._v(" "),
                      _vm.isAuthenticated
                        ? _c(
                            "v-btn",
                            {
                              attrs: { color: "primary", outlined: "" },
                              on: { click: _vm.signOut },
                            },
                            [_vm._v(" SignOut ")]
                          )
                        : _c(
                            "v-btn",
                            {
                              attrs: { color: "primary", outlined: "" },
                              on: {
                                click: function ($event) {
                                  return _vm.SET_EMAIL_VERIFICATION_SCREEN_SHOWN(
                                    false
                                  )
                                },
                              },
                            },
                            [_vm._v(" SignIn ")]
                          ) ],
                    1
                  ) ],
                1
              ) ]) ],
      1
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$1 = {
    components: {
      VIcon: lib.VIcon,
      VBtn: lib.VBtn,
      VTooltip: lib.VTooltip,
      VContainer: lib.VContainer
    },

    computed: Object.assign({}, Vuex.mapState("auth", ["config"]),
      Vuex.mapGetters("auth", ["isLoading", "isLoginWithProvidersActive", "isOnlySingleProvider"])),

    methods: Object.assign({}, Vuex.mapActions("auth", ["loginWithGoogle", "loginWithFacebook", "loginWithPhone", "loginWithSaml"]),
      Vuex.mapMutations("auth", ["SET_SHOW_LOGIN_WITH_PHONE"]))
  };

  /* script */
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm.isLoginWithProvidersActive
      ? _c(
          "v-container",
          { staticClass: "text-center ma-0 pa-0" },
          [
            _c("div", { staticClass: "caption" }, [
              _vm.config.email ? _c("span", [_vm._v("or ")]) : _vm._e(),
              _vm._v("login with") ]),
            _vm._v(" "),
            _c(
              "v-container",
              [
                _vm.config.google
                  ? _c(
                      "v-tooltip",
                      {
                        attrs: { top: "" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "activator",
                              fn: function (ref) {
                                var on = ref.on;
                                var attrs = ref.attrs;
                                return [
                                  _c(
                                    "v-btn",
                                    _vm._g(
                                      _vm._b(
                                        {
                                          staticClass: "mr-2",
                                          attrs: {
                                            color: "#db3236",
                                            fab: !_vm.isOnlySingleProvider,
                                            dark: "",
                                            small: "",
                                          },
                                          on: {
                                            click: function ($event) {
                                              return _vm.loginWithGoogle()
                                            },
                                          },
                                        },
                                        "v-btn",
                                        attrs,
                                        false
                                      ),
                                      on
                                    ),
                                    [_c("v-icon", [_vm._v("mdi-google")])],
                                    1
                                  ) ]
                              },
                            } ],
                          null,
                          false,
                          2619599060
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("span", [_vm._v("Authenticate with Gmail Account")]) ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.config.facebook
                  ? _c(
                      "v-tooltip",
                      {
                        attrs: { top: "" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "activator",
                              fn: function (ref) {
                                var on = ref.on;
                                var attrs = ref.attrs;
                                return [
                                  _c(
                                    "v-btn",
                                    _vm._g(
                                      _vm._b(
                                        {
                                          staticClass: "mr-2",
                                          attrs: {
                                            color: "#3b5998",
                                            fab: !_vm.isOnlySingleProvider,
                                            dark: "",
                                            small: "",
                                          },
                                          on: {
                                            click: function ($event) {
                                              return _vm.loginWithFacebook()
                                            },
                                          },
                                        },
                                        "v-btn",
                                        attrs,
                                        false
                                      ),
                                      on
                                    ),
                                    [_c("v-icon", [_vm._v("mdi-facebook")])],
                                    1
                                  ) ]
                              },
                            } ],
                          null,
                          false,
                          1832197962
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("span", [
                          _vm._v("Authenticate with Facebook Account") ]) ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.config.phone
                  ? _c(
                      "v-tooltip",
                      {
                        attrs: { top: "" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "activator",
                              fn: function (ref) {
                                var on = ref.on;
                                var attrs = ref.attrs;
                                return [
                                  _c(
                                    "v-btn",
                                    _vm._g(
                                      _vm._b(
                                        {
                                          staticClass: "mr-2",
                                          attrs: {
                                            color: "primary",
                                            fab: !_vm.isOnlySingleProvider,
                                            dark: "",
                                            small: "",
                                          },
                                          on: {
                                            click: function ($event) {
                                              return _vm.SET_SHOW_LOGIN_WITH_PHONE(
                                                true
                                              )
                                            },
                                          },
                                        },
                                        "v-btn",
                                        attrs,
                                        false
                                      ),
                                      on
                                    ),
                                    [_c("v-icon", [_vm._v("mdi-cellphone")])],
                                    1
                                  ) ]
                              },
                            } ],
                          null,
                          false,
                          1894239944
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("span", [
                          _vm._v("Authenticate with Text Message To Your Phone") ]) ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.config.saml
                  ? _c(
                      "v-tooltip",
                      {
                        attrs: { top: "" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "activator",
                              fn: function (ref) {
                                var on = ref.on;
                                var attrs = ref.attrs;
                                return [
                                  _c(
                                    "v-btn",
                                    _vm._g(
                                      _vm._b(
                                        {
                                          attrs: {
                                            color: "secondary",
                                            fab: !_vm.isOnlySingleProvider,
                                            dark: "",
                                            small: !_vm.isOnlySingleProvider,
                                          },
                                          on: {
                                            click: function ($event) {
                                              return _vm.loginWithSaml()
                                            },
                                          },
                                        },
                                        "v-btn",
                                        attrs,
                                        false
                                      ),
                                      on
                                    ),
                                    [
                                      _c("v-icon", [_vm._v("mdi-onepassword")]),
                                      _vm._v(" "),
                                      _vm.isOnlySingleProvider
                                        ? _c("span", { staticClass: "ml-2" }, [
                                            _vm._v(_vm._s(_vm.config.saml_text)) ])
                                        : _vm._e() ],
                                    1
                                  ) ]
                              },
                            } ],
                          null,
                          false,
                          1818462210
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("span", [_vm._v("Authenticate with SAML provider")]) ]
                    )
                  : _vm._e() ],
              1
            ) ],
          1
        )
      : _vm._e()
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  var script = {
    name: "AuthenticationGuard",

    components: {
      Login: __vue_component__$6,
      Register: __vue_component__$5,
      PasswordReset: __vue_component__$4,
      LoginWithPhone: __vue_component__$3,
      EmailVerification: __vue_component__$2,
      LoginWithProvider: __vue_component__$1,
      VProgressLinear: lib.VProgressLinear,
      VTab: lib.VTab,
      VTabs: lib.VTabs,
      VTabItem: lib.VTabItem,
      VTabsItems: lib.VTabsItems,
      VCardActions: lib.VCardActions,
      VCard: lib.VCard,
      VContainer: lib.VContainer,
      VDialog: lib.VDialog
    },

    data: function data() {
      return {
        top: this.$vuetify.application.top,
      }
    },

    computed: Object.assign({}, Vuex.mapState("auth", ["config", "tab"]),
      Vuex.mapGetters("auth", [
        "isLoading",
        "isAuthenticated",
        "isLoginWithPhoneShown",
        "isAuthGuardDialogShown",
        "isAuthGuardDialogPersistent",
        "isUserRegistrationAllowed",
        "isEmailVerificationScrenShown",
        "isResetPasswordScreenShown" ]),

      {currentRoute: function currentRoute() {
        return this.$route.path
      },

      debug: function debug() {
        return this.config.debug
      }}),

    watch: {
      currentRoute: function currentRoute(after, before) {
        if (typeof before === "undefined") { return }
        if (this.debug) { console.log("[ auth guard ]: vue router current route change: [", before, "] -> [", after, "]"); }

        authCheck();
      },
    },

    mounted: function mounted() {
      // this is equivalent to onAuthStateChanged if the app is correctly integrated with firebase
      this.initializeGuard();
    },

    beforeUpdate: function beforeUpdate() {
      if (this.top === 0) { this.top = this.$vuetify.application.top; }
    },

    updated: function updated() {
      if (this.top !== 0) { this.$vuetify.application.top = this.top; }
    },

    methods: Object.assign({}, Vuex.mapActions("auth", ["initializeGuard", "loginWithEmail", "registerUser", "signOut", "sendVerificationEmail"]),
      Vuex.mapMutations("auth", ["SET_TAB", "SET_USER", "SET_AUTH_GUARD_DIALOG_SHOWN", "SET_PASSWORD_RESET_SCREEN_SHOWN"])),
  };

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-dialog",
      {
        attrs: {
          value: _vm.isAuthGuardDialogShown,
          persistent: _vm.isAuthGuardDialogPersistent,
          "retain-focus": false,
          "overlay-opacity": "0.95",
          "content-class": "elevation-0",
        },
        on: {
          input: function ($event) {
            return _vm.SET_AUTH_GUARD_DIALOG_SHOWN($event)
          },
        },
      },
      [
        _c(
          "v-container",
          { staticClass: "mb-5", staticStyle: { "max-width": "500px" } },
          [
            _c(
              "v-card",
              { attrs: { flat: "", outlined: "" } },
              [
                _c("v-progress-linear", {
                  attrs: { indeterminate: _vm.isLoading },
                }),
                _vm._v(" "),
                _vm.isEmailVerificationScrenShown
                  ? _c("div", [_c("EmailVerification")], 1)
                  : _c(
                      "div",
                      [
                        _c(
                          "v-tabs",
                          {
                            attrs: { value: _vm.tab, grow: "" },
                            on: {
                              change: function ($event) {
                                return _vm.SET_TAB($event)
                              },
                            },
                          },
                          [
                            !_vm.isLoginWithPhoneShown
                              ? _c(
                                  "v-tab",
                                  {
                                    on: {
                                      click: function ($event) {
                                        _vm.SET_TAB(0);
                                        _vm.SET_PASSWORD_RESET_SCREEN_SHOWN(false);
                                      },
                                    },
                                  },
                                  [_vm._v("\n            Sign In\n          ")]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.isLoginWithPhoneShown
                              ? _c("v-tab", [_vm._v(" Sign In ")])
                              : _vm._e(),
                            _vm._v(" "),
                            !_vm.isResetPasswordScreenShown &&
                            _vm.isUserRegistrationAllowed
                              ? _c("v-tab", [_vm._v(" Register ")])
                              : _vm._e(),
                            _vm._v(" "),
                            (_vm.isResetPasswordScreenShown ||
                              !_vm.isUserRegistrationAllowed) &&
                            _vm.config.email
                              ? _c("v-tab", [_vm._v(" Reset Password ")])
                              : _vm._e() ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "v-tabs-items",
                          {
                            attrs: { value: _vm.tab },
                            on: {
                              change: function ($event) {
                                return _vm.SET_TAB($event)
                              },
                            },
                          },
                          [
                            !_vm.isLoginWithPhoneShown
                              ? _c(
                                  "v-tab-item",
                                  { staticClass: "pt-5" },
                                  [_c("Login")],
                                  1
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.isLoginWithPhoneShown
                              ? _c(
                                  "v-tab-item",
                                  { staticClass: "pt-5" },
                                  [_c("LoginWithPhone")],
                                  1
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            !_vm.isResetPasswordScreenShown &&
                            _vm.isUserRegistrationAllowed
                              ? _c(
                                  "v-tab-item",
                                  { staticClass: "pt-5" },
                                  [_c("Register")],
                                  1
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            (_vm.isResetPasswordScreenShown ||
                              !_vm.isUserRegistrationAllowed) &&
                            !_vm.config.email
                              ? _c(
                                  "v-tab-item",
                                  { staticClass: "pt-5" },
                                  [_c("PasswordReset")],
                                  1
                                )
                              : _vm._e() ],
                          1
                        ) ],
                      1
                    ),
                _vm._v(" "),
                !_vm.isEmailVerificationScrenShown
                  ? _c("v-card-actions", [_c("LoginWithProvider")], 1)
                  : _vm._e() ],
              1
            ) ],
          1
        ) ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  /**
   * use cases:
   * 1. NOT authenticated user:
   * - user opens app on public route
   * - user opens app on protected route
   * - user navigates from public route to protected route
   *
   * 2. authenticated user, without confirmed email:
   * - user opens app on public route
   * - user opens app on protected route
   * - user navigates from public route to protected route
   * - user navigates from protected route to public route
   *
   * 3. authenticated user with confirmed email
   * - user opens app on public route
   * - user opens app on protected route
   * - user navigates from public route to protected route
   * - user navigates from protected route to public route
   *
   */

  function authguard (to, from, next) {
    var isRequired = to.meta.requiresAuth; // is current path required authentication
    var fromRequiresAuth = from.meta.requiresAuth; // from which page is request
    var store = Vue__default["default"].prototype.$authGuardStore;
    var debug = Vue__default["default"].prototype.$authGuardDebug;

    if (!store) { console.error("[ auth guard ]: WARNING: VueX store instance missing in AuthenticationGuard config!"); }
    else if (debug) { console.log("[ auth guard ]: vue router AuthMiddleware"); }

    // check if we are going from public page to auth required page
    if (isRequired && !fromRequiresAuth) {
      store.commit("auth/SET_IS_FROM_PUBLIC_TO_AUTH", true);
    } else { store.commit("auth/SET_IS_FROM_PUBLIC_TO_AUTH", false); }

    // change public route state depending on route
    if (!isRequired) {
      store.commit("auth/SET_IS_ROUTE_PUBLIC", true);
    } else { store.commit("auth/SET_IS_ROUTE_PUBLIC", false); }

    var isAllowed = authCheck(); // is user Authenticated

    if (debug) { console.log("[ auth guard ]: is route ALLOWED: [", isAllowed, "]"); }

    return (isRequired && isAllowed) || !isRequired ? next() : next(false)
  }

  // Declare install function executed by Vue.use()
  function install(Vue, options) {
    if ( options === void 0 ) options = {};

    if (install.installed) { return }

    install.installed = true;

    // merge default settings with user settings
    var config = Object.assign({}, defaultSettings, options);
    var router = config.router;
    var firebase = config.firebase;
    var session = config.session; if ( session === void 0 ) session = "local";
    var debug = config.debug;

    var store = config.store;

    // verify if required dependency instances are passed to this package config
    if (debug) {
      if (router === null) {
        console.error("[ auth guard ]: ERROR: vue router instance missing in AuthenticationGuard config!");
      }
      if (firebase === null) {
        console.error("[ auth guard ]: ERROR: firebase instance missing in AuthenticationGuard config!");
      }
      if (store === null) {
        console.error("[ auth guard ]: WARNING: VueX store instance missing in AuthenticationGuard config!");
      }
    }
    if (store === null) {
      // use backup store if none passed in options - backwards compatibility
      store = backupStore;
    }

    // register vuex store namespace
    store.registerModule("auth", AuthStore);

    if (debug) { console.log("[ auth guard ]: registering VueX namespace: auth"); }

    // save store in Vue.prototype to be accessible authcheck.js
    Vue.prototype.$authGuardDebug = debug;
    Vue.prototype.$authGuardStore = store;
    Vue.prototype.$authGuardRouter = router;
    Vue.prototype.$authGuardSession = session;
    Vue.prototype.$authGuardFirebaseApp = firebase;

    delete config.store;
    delete config.router;
    delete config.firebase;

    // commit npm package config to vuex store
    store.commit("auth/SET_CONFIG", config);

    Vue.directive("mask", directive);
    Vue.component("AuthenticationGuard", __vue_component__);
  }

  // Create module definition for Vue.use()
  var plugin = {
    install: install,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;

  if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
  } else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.AuthMiddleware = authguard;
  exports["default"] = plugin;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

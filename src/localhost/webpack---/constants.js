Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * List of data action names.
 * @type {Object<string, string>}
 */
var Action = exports.Action = {
    APP_START: 'APP_START',
    LOCALSTORAGE_INIT: 'LOCALSTORAGE_INIT',
    SET_AVAST_INFO: 'SET_AVAST_INFO',
    SET_WELCOME_PAGE_SHOWN: 'SET_WELCOME_PAGE_SHOWN',
    SET_NM_ALIVE: 'SET_NM_ALIVE',
    LANDING_UPDATE: 'LANDING_UPDATE',
    SWITCHER_DISABLE: 'SWITCHER_DISABLE',
    SWITCHER_SET_AUTO: 'SWITCHER_SET_AUTO',
    OPTIONS_SWITCHER_SET_AUTO_ADD: 'OPTIONS_SWITCHER_SET_AUTO_ADD',
    OPTIONS_SWITCHER_SET_AUTO_REMOVE: 'OPTIONS_SWITCHER_SET_AUTO_REMOVE',
    SWITCHER_HIDE: 'SWITCHER_HIDE',
    OPTIONS_SET_PROFILE: 'OPTIONS_SET_PROFILE',
    OPTIONS_SWITCHER_HIDE_ADD: 'OPTIONS_SWITCHER_HIDE_ADD',
    OPTIONS_SWITCHER_HIDE_REMOVE: 'OPTIONS_SWITCHER_HIDE_REMOVE',
    WINDOW_ADD: 'WINDOW_ADD',
    WINDOW_REMOVE: 'WINDOW_REMOVE',
    WINDOW_SET_CURRENT: 'WINDOW_SET_CURRENT',
    BAR_SET: 'BAR_SET',
    BAR_REMOVE: 'BAR_REMOVE',
    SET_REDIRECT_URL: 'SET_REDIRECT_URL'

    /**
     * List of all local storage entries.
     * @type {Object<string, string>}
     */
};
var LocalStorage = exports.LocalStorage = {
    WELCOME_SHOWN: 'welcomePageShown',
    LANDING_HIDDEN: 'landingPageHide',
    SWITCHER_DISABLED: 'hideNotificationFor',
    SWITCHER_AUTO: 'autoSwitchFor',
    SWITCHER_HIDDEN: 'switcher_hidden',
    OPTIONS_SET_PROFILE: 'option_use_profile',
    setupGuid: 'setupGuid',
    svcVersion: 'svcVersion'

    /**
     * List of browser mode names.
     * @type {Object<string, string>}
     */
};
var Mode = exports.Mode = {
    DEFAULT: 'DEF',
    PAY: 'SZ'

    /**
     * List of internal messages.
     * @type {Object<string, string>}
     */
};
var InternalMessage = exports.InternalMessage = {
    SHOW_AUTOSWITCH_BAR: 'SHOW_AUTOSWITCH_BAR',
    SHOW_AUTOSWITCH_OVERLAY: 'SHOW_AUTOSWITCH_OVERLAY',
    CLOSE_AUTOSWITCH_OVERLAY: 'CLOSE_AUTOSWITCH_OVERLAY',
    OPEN_PAYMODE: 'OPEN_PAYMODE',
    SWITCH_PAYMODE: 'SWITCH_PAYMODE',
    URL_CHANGED: 'URL_CHANGED',
    HIDE_LANDING: 'HIDE_LANDING',
    SWITCHER_DISABLE: 'SWITCHER_DISABLE',
    SWITCHER_SET_AUTO: 'SWITCHER_SET_AUTO',
    SWITCHER_REMOVE_AUTO: 'SWITCHER_REMOVE_AUTO',
    SWITCHER_IS_AUTO_SWITCH: 'SWITCHER_IS_AUTO_SWITCH',
    SWITCHER_IS_AUTO_SWITCH_RESULT: 'SWITCHER_IS_AUTO_SWITCH_RESULT',
    OPTIONS_SWITCHER_SET_AUTO_ADD: 'OPTIONS_SWITCHER_SET_AUTO_ADD',
    OPTIONS_SWITCHER_SET_AUTO_REMOVE: 'OPTIONS_SWITCHER_SET_AUTO_REMOVE',
    OPTIONS_SWITCHER_HIDE_ADD: 'OPTIONS_SWITCHER_HIDE_ADD',
    OPTIONS_SWITCHER_HIDE_REMOVE: 'OPTIONS_SWITCHER_HIDE_REMOVE',
    BAR_CLOSE: 'BAR_CLOSE',
    BAR_CLOSED: 'BAR_CLOSED',
    HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
    OPTIONS_SET_PROFILE: 'OPTIONS_SET_PROFILE',
    SET_AUTOSWITCH: 'SET_AUTOSWITCH',
    GET_APP_SETTINGS: 'GET_APP_SETTINGS',
    APP_SETTINGS: 'GET_APP_SETTINGS'

    /**
     * List of native messages.
     * @type {Object<string, string>}
     */
};
var NativeMessage = exports.NativeMessage = {
    BROWSER_MODE_SET: 'SetBrowserMode_SvcNm',
    INIT: 'Init_NmSvc',
    OPEN_PAYMODE: 'OpenInSz_NmSvc',
    SWITCH_PAYMODE: 'switchMode',
    CLOSE_PAYMODE: 'CloseSz_NmSvc'

    /**
     * List of application units (scripts): background, content etc.
     * @type {Object<string, string>}
     */
};
var Unit = exports.Unit = {
    BG: 'BG',
    CT: 'CT',
    BAR: function BAR(id) {
        return 'BAR.' + id;
    },
    LANDING: 'LANDING'

    /**
     * Height of Bank Mode notification bar in px.
     * @type {number}
     */
};
var BarHeight = exports.BarHeight = 40;
var AnchorElementId = exports.AnchorElementId = 'bm-2225254214';
var RIPPLE_EFFECT_CLASS = exports.RIPPLE_EFFECT_CLASS = 'ripple-effect';
var SHOW_OVERLAY_TIMEOUT = exports.SHOW_OVERLAY_TIMEOUT = 2000;
/**
 * List of external (cross-extensions) messages.
 * @type {Object<string, string>}
 */
var ExternalMessage = exports.ExternalMessage = {};

//# sourceURL=webpack:///./constants.js?
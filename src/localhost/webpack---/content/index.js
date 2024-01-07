var _react = __webpack_require__( /*! react */ "../../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__( /*! react-dom */ "../../node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _extensionMessaging = __webpack_require__( /*! extension-messaging */ "../../node_modules/extension-messaging/dist/extension-messaging.js");

var _extensionMessaging2 = _interopRequireDefault(_extensionMessaging);

var _randomstring = __webpack_require__( /*! randomstring */ "../../node_modules/randomstring/index.js");

var _randomstring2 = _interopRequireDefault(_randomstring);

var _constants = __webpack_require__( /*! ../constants */ "./constants.js");

var _app = __webpack_require__( /*! ../app/app */ "./app/app.jsx");

var _app2 = _interopRequireDefault(_app);

var _utils = __webpack_require__( /*! ./utils */ "./content/utils.js");

__webpack_require__( /*! sz-common-ui/styl/style */ "../../node_modules/sz-common-ui/styl/style.styl");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var clientId = _constants.Unit.BAR(_randomstring2.default.generate());
var client = new _extensionMessaging2.default.InternalClient(clientId);

document.addEventListener('DOMContentLoaded', function() {
    if (/^http/.test(window.location.href)) {
        client.send(_constants.InternalMessage.URL_CHANGED, {
            url: window.location.href
        });
    }
});

client.on(_constants.InternalMessage.SHOW_AUTOSWITCH_BAR, function() {
    var anchor = (0, _utils.getTopElement)(_constants.AnchorElementId);
    console.log("showing bar");
    _reactDom2.default.render(_react2.default.createElement(_app2.default, {
        InternalMessage: _constants.InternalMessage,
        ClientId: clientId,
        Client: client
    }), anchor);
});

window.addEventListener('beforeunload', function() {
    client.close();
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.NativeMessage == "PAYMODE_CLOSED") {
        sendResponse({
            status: "ok"
        });
        client.emit(_constants.InternalMessage.CLOSE_AUTOSWITCH_OVERLAY);
    }
});

//# sourceURL=webpack:///./content/index.js?
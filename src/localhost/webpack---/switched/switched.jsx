

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "../../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

__webpack_require__(/*! ../../css/switched.styl */ "../css/switched.styl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import './style.inline.css'


var Switched = function (_React$Component) {
    _inherits(Switched, _React$Component);

    _createClass(Switched, null, [{
        key: 'defaultProps',
        get: function get() {
            return {
                text: {
                    openedInPayMode: chrome.i18n.getMessage('openedInPayMode'),
                    openedInPayModeDescription: chrome.i18n.getMessage('openedInPayModeDescription'),
                    openedInPayModeClose: chrome.i18n.getMessage('openedInPayModeClose'),
                    checkBoxAlways: chrome.i18n.getMessage('openedInPayModeAutomatically'),
                    switchBackToBankMode: chrome.i18n.getMessage('switchBackToBankMode'),
                    BankMode: chrome.i18n.getMessage('BankMode'),
                    StandardDesktop: chrome.i18n.getMessage('StandardDesktop')
                },
                images: {
                    checkboxUnchecked: chrome.extension.getURL('icons/checkbox-1.png'),
                    checkboxChecked: chrome.extension.getURL('icons/checkbox-2.png'),
                    bankMode: chrome.extension.getURL('icons/bm-icon.png'),
                    cross: chrome.extension.getURL('icons/icon-cross.png'),
                    windows: chrome.extension.getURL('icons/icon-windows.png')
                }
            };
        }

        /**
         * @constructor
         */

    }]);

    function Switched(props) {
        _classCallCheck(this, Switched);

        var _this = _possibleConstructorReturn(this, (Switched.__proto__ || Object.getPrototypeOf(Switched)).call(this, props));

        _this._onOpen = function (e) {
            _this.props.Client.send(_this.props.InternalMessage.OPEN_PAYMODE, {});
        };

        _this._onSwitch = function (e) {
            _this.props.Client.send(_this.props.InternalMessage.SWITCH_PAYMODE, {});
        };

        _this._onToggleCheckbox = function (e) {
            _this.state.remember = !_this.state.remember;
            if (_this.state.remember) {
                _this.setState({ checkboxImage: _this.props.images.checkboxChecked });
                _this._onCheckboxLeave(e);
            } else {
                _this.setState({ checkboxImage: _this.props.images.checkboxUnchecked });
            }
        };

        _this._onCheckboxEnter = function (e) {
            if (!_this.state.remember) {
                var cbEl = document.getElementById('bankmode--remember');
                cbEl.setAttribute('style', 'filter: brightness(0.1) invert(0.8)');
            }
        };

        _this._onCheckboxLeave = function (e) {
            var cbEl = document.getElementById('bankmode--remember');
            cbEl.setAttribute('style', '');
        };

        _this._onClose = function (e) {
            if (_this.state.remember) {
                _this.props.Client.send(_this.props.InternalMessage.SWITCHER_SET_AUTO, { barId: _this.props.ClientId });
            } else {
                _this.props.Client.send(_this.props.InternalMessage.SWITCHER_REMOVE_AUTO, { url: document.location.href });
            }
            _this.props.Client.emit(_this.props.InternalMessage.CLOSE_AUTOSWITCH_OVERLAY);
        };

        _this.state = {
            remember: false,
            checkboxImage: props.images.checkboxUnchecked
        };
        return _this;
    }

    /**
     * Triggers, when user selects one time switch option.
     * Opens page in bank mode and closes notification bar.
     * @private
     */


    _createClass(Switched, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.props.Client.on(this.props.InternalMessage.SWITCHER_IS_AUTO_SWITCH_RESULT, function (response) {
                if (response.isUrlAutoSwitch) {
                    _this2.setState({ remember: response.isUrlAutoSwitch });
                    _this2.setState({ checkboxImage: _this2.props.images.checkboxChecked });
                }
            });
            this.props.Client.send(this.props.InternalMessage.SWITCHER_IS_AUTO_SWITCH, { url: document.location.href });
        }

        /**
         * Triggers when user clicks the checkbox to hide the bar for the current site
         * @param e
         * @private
         */


        /**
         * Triggers when the user hovers the checkbox
         * @param e
         * @private
         */


        /**
         * Triggers when the user leaves the checkbox
         * @param e
         * @private
         */

    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'avast-extension-overlay' },
                _react2.default.createElement(
                    'div',
                    { className: 'avast-extension-topbar' },
                    _react2.default.createElement(
                        'div',
                        { className: 'bm-row' },
                        _react2.default.createElement('div', { className: 'bm-col-sm-2' }),
                        _react2.default.createElement(
                            'div',
                            { className: 'bm-col-sm' },
                            _react2.default.createElement(
                                'div',
                                { className: 'bm-center' },
                                _react2.default.createElement('img', { className: 'bm-secure-icon', src: this.props.images.bankMode }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'bm-switched-title' },
                                    this.props.text.openedInPayMode
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { onClick: this._onSwitch, className: 'bm-switched-link' },
                                    this.props.text.switchBackToBankMode
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'bm-col-sm-2' },
                            _react2.default.createElement(
                                'div',
                                { className: 'tb-b-basic', id: 'avast-browser-hide', onClick: this._onClose },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'avast-browser-hide-background' },
                                    _react2.default.createElement('img', { className: 'avast-browser-hide-img', src: this.props.images.cross })
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Switched;
}(_react2.default.Component);

exports.default = Switched;

//# sourceURL=webpack:///./switched/switched.jsx?
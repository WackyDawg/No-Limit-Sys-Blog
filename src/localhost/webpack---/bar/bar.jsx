

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "../../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

__webpack_require__(/*! ../../css/bar.styl */ "../css/bar.styl");

var _constants = __webpack_require__(/*! ../constants */ "./constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bar = function (_React$Component) {
    _inherits(Bar, _React$Component);

    _createClass(Bar, null, [{
        key: 'defaultProps',
        get: function get() {
            return {
                text: {
                    title: chrome.i18n.getMessage('notificationTitle'),
                    buttonSwitch: chrome.i18n.getMessage('notificationButtonSwitch'),
                    buttonSwitchAuto: chrome.i18n.getMessage('notificationButtonSwitchAuto'),
                    buttonDoNotShow: chrome.i18n.getMessage('notificationButtonDoNotShow'),
                    doNotShow: chrome.i18n.getMessage('notificationDoNotShow'),
                    infoMessage: chrome.i18n.getMessage('notificationInfoMessage')
                },
                images: {
                    warning: chrome.extension.getURL('icons/icon-warning.png'),
                    checkboxUnchecked: chrome.extension.getURL('icons/checkbox-1.png'),
                    checkboxChecked: chrome.extension.getURL('icons/checkbox-2.png'),
                    info: chrome.extension.getURL('icons/icon-info.png'),
                    infoHover: chrome.extension.getURL('icons/icon-info-hover.png'),
                    cross: chrome.extension.getURL('icons/icon-cross.png')
                }
            };
        }

        /**
         * @constructor
         */

    }]);

    function Bar(props) {
        _classCallCheck(this, Bar);

        var _this = _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, props));

        _this._onSwitch = function (e) {
            _this.props.Client.send(_this.props.InternalMessage.OPEN_PAYMODE, { barId: _this.props.ClientId });
            _this._closeByEvent(e);
        };

        _this._onToggleCheckbox = function (e) {
            _this.state.hideForThiSite = !_this.state.hideForThiSite;
            if (_this.state.hideForThiSite) {
                _this.setState({ checkboxImage: _this.props.images.checkboxChecked });
                _this._onCheckboxLeave(e);
            } else {
                _this.setState({ checkboxImage: _this.props.images.checkboxUnchecked });
            }
        };

        _this._onCheckboxEnter = function (e) {
            if (!_this.state.hideForThiSite) {
                var cbEl = document.getElementById('avast-browser-never-checkbox');
                cbEl.setAttribute('style', 'filter: brightness(0.1) invert(0.8)');
            }
        };

        _this._onCheckboxLeave = function (e) {
            var cbEl = document.getElementById('avast-browser-never-checkbox');
            cbEl.setAttribute('style', '');
        };

        _this._onInfoEnter = function (e) {
            _this.setState({ infoImage: _this.props.images.infoHover });
            var infoEl = document.getElementById('infoHoverDiv');
            if (infoEl.style.display == 'block') infoEl.style.display = 'none';else infoEl.style.display = 'block';
        };

        _this._onInfoLeave = function (e) {
            _this.setState({ infoImage: _this.props.images.info });
            var infoEl = document.getElementById('infoHoverDiv');
            infoEl.style.display = 'none';
        };

        _this._closeByEvent = function (e) {
            if (_this.state.hideForThiSite) {
                _this.props.Client.send(_this.props.InternalMessage.SWITCHER_DISABLE, { barId: _this.props.ClientId });
            }
            _this._setVisible(false);
        };

        _this.state = {
            hideForThiSite: false,
            checkboxImage: _this.props.images.checkboxUnchecked,
            infoImage: _this.props.images.info
        };
        return _this;
    }

    /**
     * Triggers, when user selects one time switch option.
     * Opens page in bank mode and closes notification bar.
     * @private
     */


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


    /**
     * Triggers when the user hover the info icon
     * @param e
     * @private
     */


    /**
     * Triggers when the user leaves the info icon
     * @param e
     * @private
     */


    /**
     * Removes notification bar from page.
     * @private
     */


    _createClass(Bar, [{
        key: '_setVisible',


        /**
         * Toggles notification bar (removes or adds to page).
         * Before removing from page, also forcely closes dropdown.
         * @private
         * @param {boolean} [visible] Flag, indicating wheter notification
         *     bar should be visible. If omitted, use inverse of current value.
         */
        value: function _setVisible() {
            var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (visible) {
                document.getElementById(_constants.AnchorElementId).setAttribute('style', 'display: block; margin-bottom: ' + _constants.BarHeight + 'px');
            } else {
                document.getElementById(_constants.AnchorElementId).setAttribute('style', 'margin-bottom: 0px');
                this.props.Client.emit(this.props.InternalMessage.BAR_CLOSE);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._setVisible();
        }

        /**
         * @override
         */

    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'avast-extension-topbar-promo' },
                _react2.default.createElement(
                    'div',
                    { className: 'avast-extension-topbar' },
                    _react2.default.createElement(
                        'div',
                        { className: 'avast-extension-topbar-logo-container' },
                        _react2.default.createElement('img', { className: 'avast-extension-topbar-icon',
                            src: this.props.images.warning, alt: 'warning' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'avast-extension-topbar-text-principal' },
                        this.props.text.title
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'tb-b-reopen ripple', id: 'avast-browser-switch-bn', onClick: this._onSwitch },
                        _react2.default.createElement(
                            'label',
                            { className: 'tb-b-r-text' },
                            this.props.text.buttonSwitch
                        )
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'tb-b-info', id: 'avast-browser-info', onClick: this._onInfoEnter },
                        _react2.default.createElement('img', { className: 'avast-extension-topbar-button-info-image', src: this.state.infoImage, onMouseDown: this._onInfoLeave, onMouseUp: this._onInfoEnter,
                            onMouseEnter: this._onInfoEnter, onMouseLeave: this._onInfoLeave, alt: 'info' })
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'tb-b-basic', id: 'avast-browser-hide', onClick: this._closeByEvent, title: 'close Bank Mode Bar' },
                        _react2.default.createElement(
                            'div',
                            { className: 'avast-browser-hide-background' },
                            _react2.default.createElement('img', { className: 'avast-browser-hide-img', src: this.props.images.cross })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'tb-b-basic', id: 'avast-browser-never', onMouseEnter: this._onCheckboxEnter,
                            onMouseLeave: this._onCheckboxLeave, onClick: this._onToggleCheckbox, tabindex: '0' },
                        _react2.default.createElement('input', { type: 'checkbox', id: 'avast-browser-never-checkbox-hidden', value: '0', title: this.props.text.doNotShow }),
                        _react2.default.createElement(
                            'label',
                            { 'for': 'avast-browser-never-checkbox-hidden', className: 'tb-b-b-text' },
                            this.props.text.doNotShow
                        ),
                        _react2.default.createElement('img', { className: 'avast-browser-never-img', id: 'avast-browser-never-checkbox',
                            src: this.state.checkboxImage })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { id: 'infoHoverDiv' },
                    _react2.default.createElement('div', { className: 'topbar-info-arrow' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'topbar-info-container' },
                        _react2.default.createElement('p', { className: 'toolbar-text', dangerouslySetInnerHTML: { __html: this.props.text.infoMessage } })
                    )
                )
            );
        }
    }]);

    return Bar;
}(_react2.default.Component);

exports.default = Bar;

//# sourceURL=webpack:///./bar/bar.jsx?
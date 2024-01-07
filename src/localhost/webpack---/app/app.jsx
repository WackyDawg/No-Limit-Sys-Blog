

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "../../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _bar = __webpack_require__(/*! ../bar/bar */ "./bar/bar.jsx");

var _bar2 = _interopRequireDefault(_bar);

var _switched = __webpack_require__(/*! ../switched/switched */ "./switched/switched.jsx");

var _switched2 = _interopRequireDefault(_switched);

var _constants = __webpack_require__(/*! ../constants */ "./constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        var _this$eventsStateChan;

        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this._setVisibility = function (key, val) {
            var newVisibility = Object.assign({}, _this.state.visibility);
            newVisibility[key] = val;
            _this.setState({ visibility: newVisibility });
        };

        _this.state = {
            /**
             * Component visibility map
             */
            visibility: {
                bankModeToolbar: true,
                openedInBankModeOverlay: false
            }

            /**
             * Mapping between events to their state property modification
             */
        };_this.eventsStateChangeMap = (_this$eventsStateChan = {}, _defineProperty(_this$eventsStateChan, _this.props.InternalMessage.BAR_CLOSE, function () {
            return _this._setVisibility('bankModeToolbar', false);
        }), _defineProperty(_this$eventsStateChan, _this.props.InternalMessage.SHOW_AUTOSWITCH_OVERLAY, function () {
            return _this._setVisibility('openedInBankModeOverlay', true);
        }), _defineProperty(_this$eventsStateChan, _this.props.InternalMessage.CLOSE_AUTOSWITCH_OVERLAY, function () {
            return _this._setVisibility('openedInBankModeOverlay', false);
        }), _this$eventsStateChan);
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            /**
             * Setting the event handlers for all mapped events
             */
            Object.keys(this.eventsStateChangeMap).map(function (eventName) {
                _this2.props.Client.on(eventName, function () {
                    if (typeof _this2.eventsStateChangeMap[eventName] === 'function') {
                        _this2.eventsStateChangeMap[eventName]();
                    }
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: _constants.AnchorElementId },
                this.state.visibility.bankModeToolbar && _react2.default.createElement(_bar2.default, this.props),
                this.state.visibility.openedInBankModeOverlay && _react2.default.createElement(_switched2.default, this.props)
            );
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;

//# sourceURL=webpack:///./app/app.jsx?
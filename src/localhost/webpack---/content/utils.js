/* WEBPACK VAR INJECTION */
(function($) {

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.injectExternalResource = injectExternalResource;
    exports.getTopElement = getTopElement;
    exports.applyRipple = applyRipple;

    var _constants = __webpack_require__( /*! ../constants */ "./constants.js");

    /**
     * Injects an external resource to the page head tag
     * @param resource
     * @param element
     * @param rel
     */
    function injectExternalResource(resource, element, rel) {
        var head = document.head,
            el = document.createElement(element);
        el.rel = rel;
        el.href = resource;
        head.appendChild(el);
    }

    /**
     * Returns a new HTML element prepended to the top of the page
     * @param elemId
     * @returns {HTMLElement}
     */
    function getTopElement(elemId) {
        var elemType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';

        var anchor = document.createElement(elemType);
        anchor.id = elemId;
        document.documentElement.prepend(anchor);
        return anchor;
    }

    /**
     * Attach a ripple effect on a given element
     * @param e
     */
    function applyRipple(e) {
        var target = e.target;
        var rect = target.getBoundingClientRect();
        var ripple = document.createElement('div');
        var max = Math.floor(Math.max(rect.width, rect.height) / 2);
        ripple.style.setProperty("height", max + "px", "important");
        ripple.style.setProperty("width", max + "px", "important");
        ripple.className = 'ripple-avast';
        target.appendChild(ripple);
        ripple.style.setProperty("zIndex", "-1", "important");
        var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
        var left = e.pageX - ripple.offsetWidth / 2 - document.body.scrollLeft;
        ripple.style.setProperty("top", top + "px", "important");
        ripple.style.setProperty("left", left + "px", "important");
        setTimeout(function() {
            $(ripple).remove();
        }, 3000);
    }
    /* WEBPACK VAR INJECTION */
}.call(this, __webpack_require__( /*! jquery */ "../../node_modules/jquery/dist/jquery.js")))

//# sourceURL=webpack:///./content/utils.js?
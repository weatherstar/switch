require('./switch.less');

let classList = require('classlist');

let legalSize = ['default','large','small'];

function Switch (options) {
    this._init(options)
}

Switch.options = {
    size: 'default',
    onText: 'on',
    offText: 'off',
    checked: false
};

/**
 *
 * @param el
 * @param options
 * @returns {Switch}
 * @private
 */
Switch.prototype._init = function (el, options) {
    if(!el || el.nodeType !== 1 || el.type !== 'checkbox') return;
    if(!this instanceof Switch) return new Switch(el, options);

    this._el = el;
    this._options = mergeOptions(this.constructor.options, options);
    
    this._initElement();

    this._initEvents();
    
};

/**
 *
 * @private
 */
Switch.prototype._initElement = function () {

    this._el.style.display = 'none';

    let newSwitch = this._createSwitch();
    
    initSwitchStyle(newSwitch, this._options);

    insertSwitch(newSwitch, this._el);
    
};
/**
 * make switch DOM
 */
Switch.prototype._createSwitch = function (){
    this._switch = document.createElement('span');
    this._jack = document.createElement('small');
    this._switch.appendChild(this._jack);
    return this._switch;
};

function initSwitchStyle(sw, options) {
    classList(sw).add('switch', 'switch-' + (legalSize.includes(options.size) ? options.size : 'default'));
}

function insertSwitch(source, target) {
    target.parentNode.insertBefore(source, target.nextSibling);
}

Switch.prototype._initEvents = function () {
    this._jack.addEventListener('click', changeSwitchState);
};
function changeSwitchState() {
    
}

function mergeOptions(a, b, s) {
    let options = {};
    if(!b)return a;
    Object.keys(b).forEach(key => {
        options[key] = a[key] || b[key];
    });
    return options;
}

export default Switch
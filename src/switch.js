require('./switch.less');

let classList = require('classlist');

let legalSize = ['default','large','small'];

const SWITCH_BORDER_COLOR = '#dfdfdf';
const SWITCH_ON_CLASS = 'switch-on';
const SWITCH_OFF_CLASS = 'switch-off';

function Switch (el, options) {
    this._init(el, options)
}

Switch.options = {
    size: 'default',
    onText: 'on',
    offText: 'off',
    onSwitchColor: '#F15648',
    offSwitchColor: '#fff',
    onJackColor: '#fff',
    offJackColor: '#fff'
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
    if(el._switch)return el._switch;
    if(!this instanceof Switch) return new Switch(el, options);

    this._el = el;
    this._el._switch = this;
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
    if(this._options.checked !== undefined){
        this._el.checked = Boolean(this._options.checked);
    }else {
        this._options.checked = this._el.checked;
    }

    let newSwitch = this._createSwitch();
    initSwitchStyle(newSwitch, this._options, this);
    setJackText.call(this);
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

function initSwitchStyle(swEl, options, sw) {
    classList(swEl).
        add(
        'switch',
        'switch-' + (legalSize.includes(options.size) ? options.size : 'default'),
        options.checked ? SWITCH_ON_CLASS : SWITCH_OFF_CLASS
    );
    setSwitchColor.call(sw);

}

function insertSwitch(source, target) {
    target.parentNode.insertBefore(source, target.nextSibling);
}

function setSwitchColor() {
    this._switch.style.boxShadow = this._el.checked ?
        ('inset 0 0 0 16px  ' + this._options.onSwitchColor) :
        ('inset 0 0 0 0  ' + this._options.offSwitchColor);
    this._switch.style.border = '1px solid ' + (this._el.checked ? this._options.onSwitchColor : SWITCH_BORDER_COLOR)
    this._jack.style.backgroundColor = (this._el.checked ? this._options.onJackColor : this._options.offJackColor);
}

function setJackText() {
    if(!this._options.showText)return;
    this._jack.innerHTML = this._el.checked ? this._options.onText : this._options.offText;
}

Switch.prototype._initEvents = function () {
    this._events =  new Map([
        [this._el, 'change changeSwitchStateFromCheckbox'],
        [this._switch, 'click changeSwitchStateFromSwitch']
    ]);
    bindEvents(this._events,this);
};

let switchEventsHandles = {
    changeSwitchStateFromCheckbox(){
        this._toggle(this._el.checked);
    },
    changeSwitchStateFromSwitch(){
        this._toggle();
    }
};


function bindEvents(events, sw) {
    for(let[el, value] of events){
        value = value.split(' ');
        (function (event, func) {
            el.addEventListener(event,function (e) {
                switchEventsHandles[func].call(sw, e);
            })
        })(value[0], value[1]);
    }
}

/**
 *
 * @param checked
 * @private
 */
Switch.prototype._toggle = function (checked) {
    this._el.checked = checked === undefined ? !this._el.checked : checked;
    let addClass = this._el.checked ? SWITCH_ON_CLASS : SWITCH_OFF_CLASS;
    let removeClass = this._el.checked ? SWITCH_OFF_CLASS : SWITCH_ON_CLASS;
    classList(this._switch)
        .add(addClass)
        .remove(removeClass);
    setJackText.call(this);
    setSwitchColor.call(this);
};

/**
 * @public
 */
Switch.prototype.on = function () {
    this._on(SWITCH_ON_CLASS, SWITCH_OFF_CLASS, true);
};

/**
 * @public
 */
Switch.prototype.off = function () {
    this._off(SWITCH_OFF_CLASS, SWITCH_ON_CLASS, false);
};

/**
 * @public
 */
Switch.prototype.toggle = function () {
    this._toggle();
};

Switch.prototype.remove = function () {

};

function mergeOptions(a, b, s) {
    if(!b)return a;
    Object.keys(b).forEach(key => {
        a[key] = b[key];
    });
    return a;
}

export default Switch
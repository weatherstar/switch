require('./switch.less');
let fastclick = require('fastclick');

let classList = require('classlist');

let legalSize = ['default','large','small'];

let switchEventsHandles = {
    changeSwitchStateFromCheckbox(){
        this._switch._toggle(this.checked);
    },
    changeSwitchStateFromSwitch(){
        if(this._instance._options.disabled)return;
        this._instance._toggle();
    },
    changeSwitchStateFromKeyboard(e){
        var key = e.which || e.keyCode || 0;
        if(this._instance._options.disabled)return;
        if(key === 13){
            this._instance._toggle();
        }
    }
};

const SWITCH_BORDER_COLOR = '#dfdfdf';
const SWITCH_ON_CLASS = 'switch-on';
const SWITCH_OFF_CLASS = 'switch-off';

function Switch (el, options) {
    this._init(el, options)
}

/************************* private methods *************************/

/** switch init
 *
 * @param el
 * @param options
 * @returns {Switch}
 * @private
 */
Switch.prototype._init = function (el, options) {

    let defaultOptions = {
        size: 'default',
        checked: undefined,
        onText: 'Y',
        offText: 'N',
        onSwitchColor: '#64BD63',
        offSwitchColor: '#fff',
        onJackColor: '#fff',
        offJackColor: '#fff',
        showText: false,
        disabled: false,
        onInit: noop,
        beforeChange: noop,
        onChange: noop,
        beforeRemove: noop,
        onRemove: noop,
        beforeDestroy: noop,
        onDestroy: noop
    };
    
    if(!el || el.nodeType !== 1 || el.type !== 'checkbox') return;
    if(el._switch)return el._switch;
    if(!this instanceof Switch) return new Switch(el, options);

    this._el = el;
    this._el._switch = this;
    this._options = mergeOptions(defaultOptions, options);
    this._initElement();

    this._initEvents();

    this._options.onInit.call(this);
};

/**use switch instead of checkbox
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
    initSwitchAttr(newSwitch, this._options);
    insertSwitch(newSwitch, this._el);
    initSwitchStyle(newSwitch, this._options, this);
    fastclick.attach(newSwitch);
};
/**
 * make switch DOM
 *
 * @private
 */
Switch.prototype._createSwitch = function (){
    this._switch = document.createElement('span');
    this._jack = document.createElement('small');
    this._switch.appendChild(this._jack);
    this._switch._instance = this;
    return this._switch;
};


Switch.prototype._initEvents = function () {
    this._events =  new Map([
        ['change changeSwitchStateFromCheckbox', this._el],
        ['click changeSwitchStateFromSwitch', this._switch],
        ['keypress changeSwitchStateFromKeyboard',this._switch]
    ]);
    bindEvents(this._events,this);
};

/**toggle switch and the checkbox.
 *
 * @param checked
 * @private
 */
Switch.prototype._toggle = function (checked) {
    this._options.beforeChange.call(this, this._el.checked);
    this._el.checked = checked === undefined ? !this._el.checked : checked;
    this._options.onChange.call(this, this._el.checked);
    let addClass = this._el.checked ? SWITCH_ON_CLASS : SWITCH_OFF_CLASS;
    let removeClass = this._el.checked ? SWITCH_OFF_CLASS : SWITCH_ON_CLASS;
    this._switch.setAttribute('aria-checked', this._el.checked);
    classList(this._switch)
        .add(addClass)
        .remove(removeClass);
    setJackPosition.call(this);
    setJackText.call(this);
    setSwitchColor.call(this);
};

/************************* public methods *************************/

/**return checkbox status
 *
 * @public
 */
Switch.prototype.getChecked = function () {
    return this._el.checked;
};

/**set switch ON
 *
 * @public
 */
Switch.prototype.on = function () {
    this._toggle(true);
};

/**set switch OFF
 *
 * @public
 */
Switch.prototype.off = function () {
    this._toggle(false);
};

/**toggle switch
 *
 * @public
 */
Switch.prototype.toggle = function () {
    this._toggle();
};

/**disable switch
 *
 *@public
 */
Switch.prototype.disable = function () {
    setSwitchDisabled.call(this, this._options.disabled = true);
};

/**enable switch
 *
 *@public
 */
Switch.prototype.enable = function () {
    setSwitchDisabled.call(this, this._options.disabled = false);
};

/**
 * remove all events bind to switch
 *
 * @public
 */
Switch.prototype.destroy = function () {
    this._options.beforeDestroy.call(this, this._el.checked);
    unbindEvents(this._events,this);
    this._options.onDestroy.call(this);
};

/**
 * remove switch form DOM and show the checkbox
 *
 * @public
 */
Switch.prototype.remove = function () {
    this._options.beforeRemove.call(this, this._el.checked);
    try {
        this._el.setAttribute('style',this._el.getAttribute('style').replace(/\s*display:\s*none;/g,''));
    }catch (e){}
    if(this._switch.parentNode){
        this._switch.parentNode.removeChild(this._switch);
        this._options.onRemove.call(this);
    }
};


function noop() {}

function initSwitchStyle(swEl, options, sw) {
    classList(swEl).
    add(
        'switch',
        'switch-' + (legalSize.includes(options.size) ? options.size : 'default'),
        options.checked ? SWITCH_ON_CLASS : SWITCH_OFF_CLASS
    );
    setJackText.call(sw);
    setSwitchColor.call(sw);
    setJackPosition.call(sw);
    setSwitchDisabled.call(sw, sw._options.disabled);
}

function initSwitchAttr(swEl, options) {
    swEl.setAttribute('tabindex', 0);
    swEl.setAttribute('role', 'checkbox');
    swEl.setAttribute('aria-checked', options.checked);
    swEl.setAttribute('aria-disabled', options.disabled);
}

function insertSwitch(source, target) {
    target.parentNode.insertBefore(source, target.nextSibling);
}

function setSwitchColor() {
    if(this._el.checked){
        this._switch.style.boxShadow = 'inset 0 0 0 ' +  this._switch.clientHeight/1.8  + 'px ' + this._options.onSwitchColor;
        this._switch.style.border = '1px solid ' + this._options.onSwitchColor;
        this._switch.style.transition = 'border 0.4s, box-shadow 0.4s, background-color 1.4s';
        this._switch.style.backgroundColor = this._options.onSwitchColor;
        this._jack.style.backgroundColor = this._options.onJackColor;
    }else {
        this._switch.style.boxShadow = 'inset 0 0 0 0  ' + this._options.offSwitchColor;
        this._switch.style.border = '1px solid ' + SWITCH_BORDER_COLOR;
        this._switch.style.transition = 'border 0.4s, box-shadow 0.4s';
        this._switch.style.backgroundColor = this._options.offSwitchColor;
        this._jack.style.backgroundColor = this._options.offJackColor;
    }
}

function setSwitchDisabled(disabled) {
    this._el.disabled = disabled;
    classList(this._switch)[disabled? 'add' : 'remove']('switch-disabled');
    this._switch.setAttribute('aria-disabled', disabled);
}

function setJackPosition() {
    let offset = parseInt(window.getComputedStyle(this._switch).width) - parseInt(window.getComputedStyle(this._jack).width);
    this._jack.style.left = this._el.checked ? offset+'px' : 0;
}

function setJackText() {
    if(!this._options.showText)return;
    this._jack.innerHTML = this._el.checked ? this._options.onText : this._options.offText;
}

function mergeOptions(a, b) {
    if(!b)return a;
    Object.keys(b).forEach(key => {
        a[key] = b[key];
    });
    return a;
}

function bindEvents(events, sw) {
    for(let[value, el] of events){
        value = value.split(' ');

        (function (event, func) {
            el.addEventListener(event, switchEventsHandles[func])
        })(value[0], value[1]);
    }
}

function unbindEvents(events,sw) {
    for(let[value, el] of events){
        value = value.split(' ');
        (function (event, func) {
            console.log();
            el.removeEventListener(event, switchEventsHandles[func]);
        })(value[0], value[1]);
    }
}

export default Switch
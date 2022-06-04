/*
* Pure JavaScript for Draggable and Risizable Dialog Box
*
* Designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
* Extended by FrankBuchholz, Germany, 2019
* Typescript'ified by Robert Adams, Oregon USA, 2022
*
* MIT License
*/
import { Logger } from '@Tools/Logging';

// When button pressed, this callback is called with the button name
type ButtonCallback = (pButtonName: string, pDialogId: string) => void;

/// <summary>
/// Make the passed HTMLElement a draggable/resizable dialog box.
/// Note that dialog is initialized with visibility=hidden.
/// </summary>
/// <param name="pId">ID of HTMLElement to make draggable/resizable</param>
/// <param name="pCallback">function called when HTMLButtonElement is clicked. Passes ID of dialog and name of button.
///      Set to 'undefined' for no callback.</param>
/// <param name="pClasses">optional object that supplies different names for classes</param>
export function DialogBox(pId: string, pCallback: ButtonCallback, pClasses?: { [ key: string]: string }): void {

    // Replacements for the class names for different dialog box regions
    const titlebarClass = pClasses['titlebar'] ?? '.titlebar';
    const contentClass = pClasses['content'] ?? '.content';
    const buttonContainerAttribute = pClasses['buttonContainer'] ?? 'buttonContainer';

    let	_minW = 100; // The exact value get's calculated
    let _minH = 1; // The exact value get's calculated
    const _resizePixel = 5;
    const _hasEventListeners = !!window.addEventListener;
    let _parent;
    let _dialog: HTMLElement;
    let _dialogTitle: HTMLElement;
    let _dialogContent: HTMLElement;
    let _maxX: number; let _maxY: number;
    let _startX: number; let _startY: number;
    let _startW: number; let _startH: number;
    let _leftPos: number; let _topPos: number;
    let _isDrag = false;
    let _isResize = false;
    let _isButton = false;
    let _isButtonHovered = false; // Let's use standard hover (see css)
    //let _isClickEvent = true; // Showing several dialog boxes work better if I do not use this variable
    let _resizeMode = '';
    let _whichButton: HTMLButtonElement;
    let _buttons: NodeListOf<HTMLButtonElement>;
    let _tabBoundary;
    let _callback: ButtonCallback; // Callback function which transfers the name of the selected button to the caller
    let _zIndex: number; // Initial zIndex of this dialog box 
    let _zIndexFlag = false; // Bring this dialog box to front 
    // let _setCursor; // Forward declaration to get access to this function in the closure
    // let _whichClick; // Forward declaration to get access to this function in the closure
    // let _setDialogContent; // Forward declaration to get access to this function in the closure

    function _addEvent(elm: Element | Document, evt: string, callback: EventListener): void {
        if (elm == null || typeof(elm) == undefined)
            return;
        if (_hasEventListeners)
            elm.addEventListener(evt, callback, false);
        // @ts-ignore
        else if (elm.attachEvent)
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                elm.attachEvent('on' + evt, callback);
            else
                // @ts-ignore
                elm['on' + evt] = callback;
    };

    function _returnEvent(evt: Event): boolean {
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (evt.preventDefault)
            evt.preventDefault();
        else {
            evt.returnValue = false;
            return false;
        }
    };

    // not used
    /*
    function _returnTrueEvent(evt: Event): boolean {
        evt.returnValue = true;
        return true;
    };
    */

    // not used
    // Mybe we should be able to destroy a dialog box, too. 
    // In this case we should remove the event listeners from the dialog box but 
    // I do not know how to identfy which event listeners should be removed from the document.
    /*
    function _removeEvent(elm: HTMLElement, evt: Event, callback): void {
        if (elm == null || typeof(elm) == undefined)
            return;
        if (window.removeEventListener)
            elm.removeEventListener(evt, callback, false);
        else if (elm.detachEvent)
            elm.detachEvent('on' + evt, callback);
    };
    */

    function _adjustFocus(evt: Event): boolean {
        evt = evt || window.event;
        if (evt.target === _dialogTitle)
            _buttons[_buttons.length - 1].focus();
        else
            _buttons[0].focus();
        return _returnEvent(evt);
    };

    function _onFocus(evt: Event): boolean {
        evt = evt || window.event;
        (evt.target as Element)?.classList.add('focus');
        return _returnEvent(evt);
    };

    function _onBlur(evt: Event): boolean {
        evt = evt || window.event;
        (evt.target as Element)?.classList.remove('focus');
        return _returnEvent(evt);
    };

    function _onClick(evt: Event): boolean {
        evt = evt || window.event;
        //if (_isClickEvent)
            _whichClick(evt.target as HTMLButtonElement);
        //else
        //	_isClickEvent = true;
        return _returnEvent(evt);
    };

    function _onMouseDown(pEvent: Event): boolean {
        const evt = (pEvent || window.event) as MouseEvent;
        _zIndexFlag = true;
        // mousedown might happen on any place of the dialog box, therefore 
        // we need to take care that this does not to mess up normal events 
        // on the content of the dialog box, i.e. to copy text
        if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]))
            return;
        const rect = _getOffset(_dialog);
        _maxX = Math.max(
            document.documentElement["clientWidth"],
            document.body["scrollWidth"],
            document.documentElement["scrollWidth"],
            document.body["offsetWidth"],
            document.documentElement["offsetWidth"]
        );
        _maxY = Math.max(
            document.documentElement["clientHeight"],
            document.body["scrollHeight"],
            document.documentElement["scrollHeight"],
            document.body["offsetHeight"],
            document.documentElement["offsetHeight"]
        );
        if (rect.right > _maxX)
            _maxX = rect.right;
        if (rect.bottom > _maxY)
            _maxY = rect.bottom;
        _startX = evt.pageX;
        _startY = evt.pageY;
        _startW = _dialog.clientWidth;
        _startH = _dialog.clientHeight;
        _leftPos = rect.left;
        _topPos = rect.top;
        if (_isButtonHovered) {
            //_whichButton.classList.remove('hover');
            _whichButton.classList.remove('focus');
            _whichButton.classList.add('active');
            _isButtonHovered = false;
            _isButton = true;
        }
        else if (evt.target === _dialogTitle && _resizeMode == '') {
            _setCursor('move');
            _isDrag = true;
        }
        else if (_resizeMode != '') {
            _isResize = true;
        }	
        const r = _dialog.getBoundingClientRect();
        return _returnEvent(evt);
    };

    function _onMouseMove(pEvent: Event): boolean {
        const evt = (pEvent || window.event) as MouseEvent;
        // mousemove might run out of the dialog box during drag or resize, therefore we need to 
        // attach the event to the whole document, but we need to take care that this  
        // does not to mess up normal events outside of the dialog box.
        if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) && !_isDrag && _resizeMode == '')
            return;
        if (_isDrag) {
            const dx = _startX - evt.pageX;
            const dy = _startY - evt.pageY;
            let left = _leftPos - dx;
            let top = _topPos - dy;
            let scrollL = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
            let scrollT = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (dx < 0) {
                if (left + _startW > _maxX)
                    left = _maxX - _startW;
            }
            if (dx > 0) {
                if (left < 0)
                    left = 0;
                }
            if (dy < 0) {
                if (top + _startH > _maxY)
                    top = _maxY - _startH;
            }
            if (dy > 0) {
                if (top < 0)
                    top = 0;
            }
            _dialog.style.left = `${left}px`;
            _dialog.style.top = `${top}px`;
            if (evt.clientY > window.innerHeight - 32)
                scrollT += 32;
            else if (evt.clientY < 32)
                scrollT -= 32;
            if (evt.clientX > window.innerWidth - 32)
                scrollL += 32;
            else if (evt.clientX < 32)
                scrollL -= 32;
            if (top + _startH == _maxY)
                scrollT = _maxY - window.innerHeight + 20;
            else if (top == 0)
                scrollT = 0;
            if (left + _startW == _maxX)
                scrollL = _maxX - window.innerWidth + 20;
            else if (left == 0)
                scrollL = 0;
            if (_startH > window.innerHeight) {
                if (evt.clientY < window.innerHeight / 2)
                    scrollT = 0;
                else
                    scrollT = _maxY - window.innerHeight + 20;
            }
            if (_startW > window.innerWidth) {
                if (evt.clientX < window.innerWidth / 2)
                    scrollL = 0;
                else
                    scrollL = _maxX - window.innerWidth + 20;
            }
            window.scrollTo(scrollL, scrollT);
        }
        else if (_isResize) {
            let dw, dh, w, h: number;
            if (_resizeMode == 'w') {
                dw = _startX - evt.pageX;
                if (_leftPos - dw < 0)
                    dw = _leftPos;
                w = _startW + dw;
                if (w < _minW) {
                    w = _minW;
                    dw = w - _startW;
                }
                _dialog.style.width = `${w}px`;
                _dialog.style.left = `${_leftPos - dw}px`; 
            }
            else if (_resizeMode == 'e') {
                dw = evt.pageX - _startX;
                if (_leftPos + _startW + dw > _maxX)
                    dw = _maxX - _leftPos - _startW;
                w = _startW + dw;
                if (w < _minW)
                    w = _minW;
                _dialog.style.width = `${w}px`;
            }
            else if (_resizeMode == 'n') {
                dh = _startY - evt.pageY;
                if (_topPos - dh < 0)
                    dh = _topPos;
                h = _startH + dh;
                if (h < _minH) {
                    h = _minH;
                    dh = h - _startH;
                }
                _dialog.style.height = `${h}px`;
                _dialog.style.top = `${_topPos - dh}px`;
            }
            else if (_resizeMode == 's') {
                dh = evt.pageY - _startY;
                if (_topPos + _startH + dh > _maxY)
                    dh = _maxY - _topPos - _startH;
                h = _startH + dh;
                if (h < _minH)
                    h = _minH;
                _dialog.style.height = `${h}px`;
            }
            else if (_resizeMode == 'nw') {
                dw = _startX - evt.pageX;
                dh = _startY - evt.pageY;
                if (_leftPos - dw < 0)
                    dw = _leftPos;
                if (_topPos - dh < 0)
                    dh = _topPos;
                w = _startW + dw;
                h = _startH + dh;
                if (w < _minW) {
                    w = _minW;
                    dw = w - _startW;
                }
                if (h < _minH) {
                    h = _minH;
                    dh = h - _startH;
                }
                _dialog.style.width = `${w}px`;
                _dialog.style.height = `${h}px`;
                _dialog.style.left = `${_leftPos - dw}px`;
                _dialog.style.top = `${_topPos - dh}px`;
            }
            else if (_resizeMode == 'sw') {
                dw = _startX - evt.pageX;
                dh = evt.pageY - _startY;
                if (_leftPos - dw < 0)
                    dw = _leftPos;
                if (_topPos + _startH + dh > _maxY)
                    dh = _maxY - _topPos - _startH;
                w = _startW + dw;
                h = _startH + dh;
                if (w < _minW) {
                    w = _minW;
                    dw = w - _startW;
                }
                if (h < _minH)
                    h = _minH;
                _dialog.style.width = `${w}px`;
                _dialog.style.height = `${h}px`;
                _dialog.style.left = `${_leftPos - dw}px`;
            }
            else if (_resizeMode == 'ne') {
                dw = evt.pageX - _startX;
                dh = _startY - evt.pageY;
                if (_leftPos + _startW + dw > _maxX)
                    dw = _maxX - _leftPos - _startW;
                if (_topPos - dh < 0)
                    dh = _topPos;
                w = _startW + dw;
                h = _startH + dh;
                if (w < _minW)
                    w = _minW;
                if (h < _minH) {
                    h = _minH;
                    dh = h - _startH;
                }
                _dialog.style.width = `${w}px`;
                _dialog.style.height = `${h}px`;
                _dialog.style.top = `${_topPos - dh}px`;
            }
            else if (_resizeMode == 'se') {
                dw = evt.pageX - _startX;
                dh = evt.pageY - _startY;
                if (_leftPos + _startW + dw > _maxX)
                    dw = _maxX - _leftPos - _startW;
                if (_topPos + _startH + dh > _maxY)
                    dh = _maxY - _topPos - _startH;
                w = _startW + dw;
                h = _startH + dh;
                if (w < _minW)
                    w = _minW;
                if (h < _minH)
                    h = _minH;
                _dialog.style.width = `${w}px`;
                _dialog.style.height = `${h}px`;
            }
            _setDialogContent();
        }
        else if (!_isButton) {
            let cs, rm = '';
            if (evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) {
                const rect = _getOffset(_dialog);
                if (evt.pageY < rect.top + _resizePixel)
                    rm = 'n';
                else if (evt.pageY > rect.bottom - _resizePixel)
                    rm = 's';
                if (evt.pageX < rect.left + _resizePixel)
                    rm += 'w';
                else if (evt.pageX > rect.right - _resizePixel)
                    rm += 'e';
            }
            if (rm != '' && _resizeMode != rm) {
                if (rm == 'n' || rm == 's')
                    cs = 'ns-resize';
                else if (rm == 'e' || rm == 'w')
                    cs = 'ew-resize';
                else if (rm == 'ne' || rm == 'sw')
                    cs = 'nesw-resize';
                else if (rm == 'nw' || rm == 'se')
                    cs = 'nwse-resize';
                _setCursor(cs);
                _resizeMode = rm;
            }
            else if (rm == '' && _resizeMode != '') {
                _setCursor('');
                _resizeMode = '';
            }
            if (evt.target != _buttons[0] && (evt.target as Element)?.tagName.toLowerCase() == 'button' || evt.target === _buttons[0] && rm == '') {
                if (!_isButtonHovered || _isButtonHovered && evt.target != _whichButton) {
                    _whichButton = evt.target as HTMLButtonElement;
                    //_whichButton.classList.add('hover');
                    _isButtonHovered = true;
                }
            }
            else if (_isButtonHovered) {
                //_whichButton.classList.remove('hover');
                _isButtonHovered = false;
            }
        }
        return _returnEvent(evt);
    };

    function _onMouseUp(pEvent: MouseEvent): boolean {
        const evt = pEvent || window.event;
        if (_zIndexFlag) {
            _dialog.style.zIndex = String(_zIndex + 1);
            _zIndexFlag = false;
        } else {
        _dialog.style.zIndex = String(_zIndex);
        }
        // mousemove might run out of the dialog box during drag or resize, therefore we need to 
        // attach the event to the whole document, but we need to take care that this  
        // does not to mess up normal events outside of the dialog box.
        if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) && !_isDrag && _resizeMode == '')
            return;
        //_isClickEvent = false;
        if (_isDrag) {
            _setCursor('');
            _isDrag = false; 
        }
        else if (_isResize) {
            _setCursor('');
            _isResize = false;
            _resizeMode = '';
        }
        else if (_isButton) {
            _whichButton.classList.remove('active');
            _isButton = false;
            _whichClick(_whichButton);
        }
        //else
        //_isClickEvent = true;
        return _returnEvent(evt);
    };

    // A button has been clicked. Call callback if specified
    function _whichClick(btn: HTMLButtonElement): void {
        _dialog.style.display = 'none';
        if (_callback) {
            const containerName = btn.getAttribute(buttonContainerAttribute) ?? undefined;
            _callback(btn.name, containerName);
        }
    };

    interface Offsets {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    function _getOffset(elm: HTMLElement): Offsets {
        const rect = elm.getBoundingClientRect();
        const offsetX = window.scrollX || document.documentElement.scrollLeft;
        const offsetY = window.scrollY || document.documentElement.scrollTop;
        return {
            left: rect.left + offsetX,
            top: rect.top + offsetY,
            right: rect.right + offsetX,
            bottom: rect.bottom + offsetY
        }
    };

    function _setCursor(cur: string): void {
        _dialog.style.cursor = cur;
        _dialogTitle.style.cursor = cur;
        _buttons[0].style.cursor = cur;
    };

    function _setDialogContent() {
        // Let's try to get rid of some of constants in javascript but use values from css
        const _dialogContentStyle = getComputedStyle(_dialogContent);

        Logger.debug(`drd._setDialogContent: clientWidth: ${_dialogContent.clientWidth}, clientHeight: ${_dialogContent.clientHeight}`);
        Logger.debug(`drd._setDialogContent: clientStyleLeft: ${_dialogContentStyle.left}, clientHeight: ${_dialogContentStyle.top}`);
        const w = _dialog.clientWidth 
                - parseInt( _dialogContentStyle.left) // .dialog .content { left: 16px; }
                - 16 // right margin?
                ;
        const h = _dialog.clientHeight - (
                parseInt(_dialogContentStyle.top) // .dialog .content { top: 48px } 
                + 16 // ?
        ); // Ensure to get minimal height

        _dialogContent.style.width = `${w}px`;
        _dialogContent.style.height = `${h}px`;

        _dialogTitle.style.width = `${w - 16}px`;
    };

    function _showDialog() {
        _dialog.style.display = 'block';
        _dialog.style.zIndex = String(_zIndex + 1);

        if (_buttons[1]) // buttons are optional
            _buttons[1].focus();
        else
            _buttons[0].focus();
    };

    function _init(id: string, callback: ButtonCallback): void {
        _dialog = document.getElementById(id);
        _callback = callback; // Register callback function

        _dialog.style.visibility = 'hidden'; // We dont want to see anything..
        _dialog.style.display = 'block'; // but we need to render it to get the size of the dialog box

        _dialogTitle = _dialog.querySelector(titlebarClass);
        _dialogContent = _dialog.querySelector(contentClass);
        _buttons = _dialog.querySelectorAll('button');  // Ensure to get minimal width

        // Set the content size parameters
        _setDialogContent();

        // Let's try to get rid of some of constants in javascript but use values from css
        const _dialogStyle = getComputedStyle(_dialog);
        const _dialogTitleStyle = getComputedStyle(_dialogTitle);
        const _dialogContentStyle = getComputedStyle(_dialogContent);


        // Calculate minimal width
        Logger.debug(`drd._init: clientWidth=${_dialog.clientWidth}, contentClientWidth=${_dialogContent.clientWidth}, contentStyleWidth=${_dialogContentStyle.width}`);
        Logger.debug(`drd._init: clientHeight=${_dialog.clientHeight}, contentClientHeight=${_dialogContent.clientHeight}, contentStyleHeight=${_dialogContentStyle.height}`);
        _minW = Math.max(_dialog.clientWidth, _dialogContent.clientWidth);

        _dialog.style.width = `${_minW}px`;

        Logger.debug(`drd._init: contentClientHeight=${_dialogContent.clientHeight}, contentStyleHeight=${_dialogContentStyle.height}`);
        Logger.debug(`drd._init: titleClientHeight=${_dialogTitle.clientHeight}, titleStyleHeight=${_dialogTitleStyle.height}`);
        // Calculate minimal height
        _minH = Math.max(_dialog.clientHeight,
                    _dialogContent.clientHeight + _dialogTitle.clientHeight + 16,
                    parseInt(_dialogContentStyle.height) + parseInt(_dialogTitleStyle.height) + 16
                    );

        _dialog.style.height = `${_minH}px`;
        Logger.debug(`drd._init: _minH=${_minH}, _minW=${_minW}`);

        // center the dialog box
        _dialog.style.left = `${(window.innerWidth - _dialog.clientWidth) / 2}px`;
        _dialog.style.top = `${(window.innerHeight - _dialog.clientHeight) / 2}px`;

        _dialog.style.display = 'none'; // Let's hide it again..
        _dialog.style.visibility = 'visible'; // and undo visibility = 'hidden'

        _dialogTitle.tabIndex = 0;

        _tabBoundary = document.createElement('div');
        _tabBoundary.tabIndex = 0;
        _dialog.appendChild(_tabBoundary);

        _addEvent(_dialog, 'mousedown', _onMouseDown);
        // mousemove might run out of the dialog during resize, therefore we need to 
        // attach the event to the whole document, but we need to take care not to mess 
        // up normal events outside of the dialog.
        _addEvent(document, 'mousemove', _onMouseMove);
        // mouseup might happen out of the dialog during resize, therefore we need to 
        // attach the event to the whole document, but we need to take care not to mess 
        // up normal events outside of the dialog.
        _addEvent(document, 'mouseup', _onMouseUp);

        if (_buttons[0].textContent == '') // Use default symbol X if no other symbol is provided
            _buttons[0].innerHTML = '&#x2716;'; // use of innerHTML is required to show  Unicode characters

        for (let i = 0; i < _buttons.length; i++) {
            _addEvent(_buttons[i], 'click', _onClick);
            _addEvent(_buttons[i], 'focus', _onFocus);
            _addEvent(_buttons[i], 'blur', _onBlur);
        }
        _addEvent(_dialogTitle, 'focus', _adjustFocus);
        _addEvent(_tabBoundary, 'focus', _adjustFocus);
    
        _zIndex = parseInt(_dialog.style.zIndex);
    };

    // Execute constructor
    _init(pId, pCallback);

    return;
}

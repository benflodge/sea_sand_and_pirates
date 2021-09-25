/* global document, window */
const addEvent = (function( window, document ) {
    if ( document.addEventListener ) {
        return function( elem, type, cb ) {
            if ( (elem && !elem.length) || elem === window ) {
                elem.addEventListener(type, cb, false );
            } else if ( elem && elem.length ) {
                const len = elem.length;
                for ( let i = 0; i < len; i++ ) {
                    addEvent( elem[i], type, cb );
                }
            }
        };
    }
    else if ( document.attachEvent ) {
        return function ( elem, type, cb ) {
            if ( (elem && !elem.length) || elem === window ) {
                elem.attachEvent( 'on' + type, function() {
                    return cb.call(elem, window.event);
                });
            }
            else if ( elem.length ) {
                const len = elem.length;
                for ( let i = 0; i < len; i++ ) {
                    addEvent( elem[i], type, cb );
                }
            }
        };
    }
})( this, document );

const keys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

function keyName(event) {
    return keys[event] || String.fromCharCode(event).toLowerCase();
}

function eventAction(event, keyDown) {
    event = event || window.event;
    const charCode = event.charCode || event.keyCode;
    //event.preventDefault();
    if (charCode){
        return (keyDown[keyName(charCode)] = true);
    }
}

function eventEnd(event, keyDown) {
    event = event || window.event;
    const charCode = event.charCode || event.keyCode;
    if (charCode){
        return (keyDown[keyName(charCode)] = false);
    }
}

export {addEvent, eventAction, eventEnd};

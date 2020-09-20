import React from 'react';
import './Modal.css';
import { CSSTransition } from 'react-transition-group';

function Modal({ isOpen, children, onCloseClick }) {

    return <CSSTransition in={isOpen} timeout={300} classNames='modal-transition' unmountOnExit>
        <div>
            <div className='Close-icon' onClick={onCloseClick}>X</div>
            {children}
        </div>
    </CSSTransition>
}

export default Modal;
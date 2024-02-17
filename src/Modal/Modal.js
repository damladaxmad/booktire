import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} style = {{
  background: props.background}}/>;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal} style = {{width: props.pwidth,
    pading: props.ppading, left: props.left, top: props.top}}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const MyModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={props.onClose} background = {props.background}/> , portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay pwidth = {props.pwidth} left = {props.left}
        ppading = {props.ppading} top = {props.top}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default MyModal;
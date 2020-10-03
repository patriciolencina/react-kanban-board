import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.scss';

Modal.propTypes = {
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  onClickOverlay: PropTypes.func,
};

Modal.defaultProps = {
  maxWidth: 350,
  onClickOverlay: () => {},
};

function Modal({ maxWidth, children, onClickOverlay }) {
  const modal = (
    <div className={styles.modal} role="presentation">
      <div className={styles.modal__content} role="dialog" style={{ maxWidth }}>
        {children}
      </div>
      <div
        className={styles.modal__overlay}
        aria-hidden="true"
        onClick={onClickOverlay}
      />
    </div>
  );

  return createPortal(modal, document.body);
}

export { Modal };

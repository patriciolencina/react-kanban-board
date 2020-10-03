import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Textarea.module.scss';

Textarea.propTypes = {
  className: PropTypes.string,
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
Textarea.defaultProps = {
  className: '',
};

function Textarea({ className, inputRef, ...props }) {
  return (
    <TextareaAutosize
      className={classes(styles.textarea, className)}
      ref={inputRef}
      {...props}
    />
  );
}

export { Textarea };

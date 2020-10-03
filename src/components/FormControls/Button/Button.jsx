import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from 'components/FormControls/Button/Button.module.scss';

Button.propTypes = {
  type: PropTypes.string,
  displayType: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
  tag: PropTypes.string,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

Button.defaultProps = {
  displayType: 'default',
  type: 'button',
  tag: 'button',
  loading: false,
};

function Button({
  type,
  displayType,
  children,
  icon,
  className,
  color,
  loading,
  innerRef,
  tag,
  ...restProps
}) {
  const TaggedButton = tag;

  return (
    <TaggedButton
      ref={innerRef}
      type={type}
      className={classnames(
        {
          [styles.button]: true,
          [styles['button--with-icon']]: !!icon,
          [className]: !!className,
          [styles.icon]: displayType === 'icon',
          [styles.loading]: loading,
        },
        styles[color]
      )}
      {...restProps}
    >
      <div>
        {icon && <span className={styles.button__icon}>{icon}</span>}
        {displayType !== 'icon' && (
          <>
            <span className={styles.button__text}>{children}</span>
          </>
        )}
      </div>
      {loading && (
        <>
          <div className={styles.button__spinner} />
        </>
      )}
    </TaggedButton>
  );
}

export { Button };

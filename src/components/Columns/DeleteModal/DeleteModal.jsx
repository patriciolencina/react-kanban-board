import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'components/Modal/Modal';
import { Button } from 'components/FormControls/Button/Button';
import styles from 'components/Columns/ColumnCard/ColumnCard.module.scss';
import { useSelector } from 'react-redux';

DeleteModal.propTypes = {
  title: PropTypes.string.isRequired,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function DeleteModal({ title, maxWidth, onDelete, onCancel }) {
  const isCardDeleting = useSelector((state) => state.tasks.isDeletingCard);
  const isListDeleting = useSelector((state) => state.tasks.isDeletingList);
  const deleteBtnRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (e && e.keyCode === 27) {
        onCancel(e);
      }
    }

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  useEffect(() => {
    if (deleteBtnRef.current) {
      deleteBtnRef.current.focus();
    }
  }, [deleteBtnRef]);

  return (
    <Modal maxWidth={maxWidth} onClickOverlay={onCancel}>
      <div className={styles['card__delete-modal']}>
        <div className={styles['delete-modal__title']}>
          {`Are you sure to delete "${title}"?`}
        </div>
        <div className={styles['delete-modal__actions']}>
          <Button
            innerRef={deleteBtnRef}
            className={styles['delete-modal__btn']}
            onClick={onDelete}
            loading={isCardDeleting || isListDeleting}
            color="red"
          >
            Delete
          </Button>
          <Button
            className={styles['delete-modal__btn']}
            onClick={onCancel}
            disabled={isCardDeleting || isListDeleting}
            color="dark-gray"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { DeleteModal };

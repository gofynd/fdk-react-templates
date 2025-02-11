import React, { useEffect, useRef } from 'react';
import * as styles from './ukt-modal.less'; // Your styles are imported as an object

function UktModal({
  isOpen = false,
  title = '',
  modalClass = '',
  isCancelable = true,
  childHandleFocus = false,
  showBack = false,
  onCloseDialog,
  showHeader,
  onBack,
  children,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && !childHandleFocus && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen, childHandleFocus]);

  if (!isOpen) {
    return null;
  }

  // If you still need to combine a passed `modalClass` prop with your module CSS,
  // you may need to ensure `modalClass` corresponds to a class in your LESS or handle it differently.
  // For now, this example assumes `modalClass` is optional and might be empty.
  
  return (
    <div 
      className={`${styles.modal} ${modalClass ? styles[modalClass] : ''}`} 
      ref={modalRef} 
      tabIndex="0"
    >
      <div className={styles.modalContainer}>
    { showHeader &&   <div className={styles.modalHeader}>
          {showBack && (
            <div className={styles.back} onClick={onBack} style={{ cursor: 'pointer' }}>

              <h1>Back</h1>
              {/* Replace with your SVG:
                  <InlineSvg src="arrow-left-black" /> 
              */}
              <span>&larr;</span>
            </div>
          )}

          <div className={`${styles.modalTitle} bold-sm`}>{title}</div>

          {isCancelable && (
            <div className={styles.cross} onClick={onCloseDialog} style={{ cursor: 'pointer' }}>
              {/* Replace with your SVG:
                  <InlineSvg src="cross-black" />
               */}
              <span>&times;</span>
            </div>
          )}
        </div>}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default UktModal;

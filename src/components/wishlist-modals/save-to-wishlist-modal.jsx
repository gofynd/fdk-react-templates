import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import CloseIcon from "../../assets/images/close-wishlist.svg";
import PlusIcon from "../../assets/images/plus-black.svg";
import MoreVerticalIcon from "../../assets/images/more-vertical.svg";
import * as styles from "./save-to-wishlist-modal.less";
import FyImage from "../core/fy-image/fy-image";
import Modal from "../core/modal/modal";

function OptionMenu({ options = [] }) {
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOptionMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option, event) => {
    if (option.popup) {
      setActivePopup(option.popup);
    }
    option.onClick?.(event);
    setIsOptionMenuOpen(false);
  };

  return (
    <div>
      <div className={styles["option-menu-container"]} ref={menuRef}>
        <button
          className={styles["three-dot-button"]}
          onClick={() => setIsOptionMenuOpen(!isOptionMenuOpen)}
        >
          <MoreVerticalIcon />
        </button>

        {isOptionMenuOpen && (
          <div className={styles["option-menu"]}>
            <ul className={styles["option-menu-list"]}>
              {options.map(
                ({ label, icon: Icon, onClick, highlight, popup }, index) => (
                  <li
                    key={index}
                    className={`${styles["option-menu-item"]} 
                      ${highlight ? styles.highlighted : ""} 
                    `}
                    onClick={(e) => handleOptionClick({ onClick, popup }, e)}
                  >
                    {Icon && <Icon />}
                    {label}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {activePopup && (
        <Modal
          isOpen={!!activePopup}
          title={activePopup.title}
          closeDialog={() => setActivePopup(null)}
          customClassName="save-to-wishlist-modal"
        >
          {activePopup.content}
        </Modal>
      )}
    </div>
  );
}

function SaveToWishlistModal({
  isOpen,
  onClose,
  onSuccess,
  customStyles,
  setSelectedWishlistIds,
  handleWishlistClick,
  selectedWishlistIds = [],
  singleSelect = false,
  productDataWishlist,
  handleOpenCreateWishlistModal,
}) {
  const [wishlists, setWishlists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, []);

  useEffect(() => {
    if (selectedWishlistIds) {
      const updatedWishlists = wishlists.map((wishlist) => ({
        ...wishlist,
        isSelected: selectedWishlistIds.includes(wishlist.id),
      }));

      const hasChanges = updatedWishlists.some(
        (wishlist, index) => wishlist.isSelected !== wishlists[index].isSelected
      );

      if (hasChanges) {
        setWishlists(updatedWishlists);
      }
    }
  }, [selectedWishlistIds]);

  const productImage = (wishlist) => {
    try {
      const items = wishlist?.cart?.items || [];
      const images = items.flatMap((item) => {
        const product = item?.product;
        if (product?.images && Array.isArray(product.images)) {
          return product.images.map((image) => image.url).filter(Boolean);
        }
        return [];
      });

      return images.slice(0, 4);
    } catch (error) {
      console.error("Error processing product images:", error);
      return [];
    }
  };

  const object = (wishlists) => {
    const response = wishlists.map((wishlist) => ({
      id: wishlist._id,
      name: wishlist.name,
      itemCount: wishlist.cart?.items?.length || 0,
      createdAt: wishlist.created_at,
      isSelected: selectedWishlistIds.includes(wishlist._id),
      previewImages: productImage(wishlist),
    }));

    return response;
  };

  const fetchWishlists = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllWishlists();
      const wishlistData = object(response.data.documents);
      setWishlists(wishlistData);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setWishlists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (wishlistId) => {
    let updatedSelectedIds;

    if (singleSelect) {
      updatedSelectedIds = [wishlistId];

      setWishlists((prev) =>
        prev.map((wishlist) => ({
          ...wishlist,
          isSelected: wishlist.id === wishlistId,
        }))
      );
    } else {
      const currentWishlist = wishlists.find((w) => w.id === wishlistId);
      updatedSelectedIds = currentWishlist?.isSelected
        ? selectedWishlistIds.filter((id) => id !== wishlistId)
        : [...selectedWishlistIds, wishlistId];

      setWishlists((prev) =>
        prev.map((wishlist) =>
          wishlist.id === wishlistId
            ? { ...wishlist, isSelected: !wishlist.isSelected }
            : wishlist
        )
      );
    }

    setSelectedWishlistIds(updatedSelectedIds);
    handleWishlistClick(wishlistId, updatedSelectedIds);
  };

  const handleCancel = () => {
    onClose();
    setShowCreateWishlist(false);
    setNewWishlistName("");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeDialog={handleCancel}
        hideHeader={true}
        ignoreClickOutsideForClass="mobile-option-menu"
      >
        <div className={`${styles.wishlistModal} ${customStyles || ""}`}>
          <div className={styles.wishlistModalHeader}>
            <div className={styles.wishlistModalTitle}>
              Save to your wishlist
            </div>
            <button
              className={styles.wishlistModalClose}
              onClick={handleCancel}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.wishlistModalContent}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading wishlists...</p>
              </div>
            ) : (
              <div className={styles.wishlistList}>
                {wishlists.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No wishlists found. Create your first wishlist!</p>
                  </div>
                ) : (
                  wishlists.map((wishlist) => (
                    <div
                      key={wishlist.id}
                      className={`${styles.wishlistItem} ${wishlist.isSelected ? styles.selected : ""}`}
                      onClick={() => {
                        handleWishlistToggle(wishlist.id);
                      }}
                    >
                      <div className={styles.wishlistCheckbox}>
                        <input
                          type="checkbox"
                          checked={wishlist.isSelected}
                          onChange={() => {
                            handleWishlistToggle(wishlist.id);
                          }}
                          className={styles.checkbox}
                        />
                      </div>

                      <div className={styles.wishlistInfo}>
                        <div className={styles.wishlistName}>
                          {wishlist.name}
                        </div>
                        <div className={styles.wishlistMeta}>
                          {wishlist.itemCount} items • Created:{" "}
                          {wishlist.createdAt}
                        </div>
                      </div>

                      {wishlist.previewImages.length > 0 && (
                        <div className={styles.wishlistPreview}>
                          <div className={styles.previewImages}>
                            {wishlist.previewImages
                              .slice(0, 2)
                              .map((item, idx) => {
                                const isLastVisible =
                                  idx === 1 &&
                                  wishlist.previewImages.length > 2;
                                return (
                                  <div
                                    className={styles.wishlistCardItem}
                                    key={idx}
                                  >
                                    <FyImage
                                      src={item}
                                      alt={"Wishlist Image"}
                                      width={40}
                                      height={40}
                                    />
                                    {isLastVisible && (
                                      <div className={styles.moreImagesOverlay}>
                                        <div>
                                          +{wishlist.previewImages.length - 2}
                                        </div>
                                        <div>More</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className={styles.createWishlistSection}>
            <button
              className={styles.createWishlistButton}
              onClick={() => {
                onClose();
                handleOpenCreateWishlistModal();
              }}
            >
              <PlusIcon />
              CREATE WISHLIST
            </button>
          </div>

          <div className={styles.wishlistModalFooter}>
            <div className={`${styles.mobileOptionMenu} mobile-option-menu`}>
              <OptionMenu
                options={[
                  {
                    label: "Create New Wishlist",
                    onClick: () => {
                      onClose();
                      handleOpenCreateWishlistModal();
                    },
                    icon: PlusIcon,
                  },
                ]}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isLoading}
              >
                CANCEL
              </button>
              <button
                className={styles.saveButton}
                onClick={() => {
                  onSuccess(
                    productDataWishlist.productPrice,
                    productDataWishlist.product,
                    selectedWishlistIds
                  );
                  onClose();
                }}
                disabled={!wishlists.some((w) => w.isSelected) || isLoading}
              >
                {isLoading ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

SaveToWishlistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productDataWishlist: PropTypes.object,
  onSuccess: PropTypes.func,
  customStyles: PropTypes.string,
  setSelectedWishlistIds: PropTypes.func,
  handleWishlistClick: PropTypes.func,
  selectedWishlistIds: PropTypes.arrayOf(PropTypes.string),
  singleSelect: PropTypes.bool,
  fetchAllWishlists: PropTypes.func,
  showSnackbarMessage: PropTypes.func,
};

export default SaveToWishlistModal;

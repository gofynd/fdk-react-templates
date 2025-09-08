import React, { useState, useEffect, useRef, useCallback } from "react";
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
  fetchAllWishlists,
}) {
  const [wishlists, setWishlists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    total: 1,
    itemTotal: 0,
    hasNext: false,
  });
  const pageSize = 10;
  const loadMoreRef = useRef(null);

  const getLoadingMoreShimmerCount = () => {
    const remainingItems = paginationInfo.itemTotal - wishlists.length;
    const shimmerCount = Math.min(remainingItems, pageSize);
    return Math.max(0, shimmerCount) || 3;
  };

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, [isOpen]);

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

  const wishlistObject = (wishlists) => {
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

  const loadMoreWishlists = useCallback(async () => {
    if (isLoadingMore || !paginationInfo.hasNext) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    try {
      setIsLoadingMore(true);
      const response = await fetchAllWishlists(nextPage, pageSize);

      setPaginationInfo({
        current: response.page?.current || nextPage,
        total: response.page?.total || 1,
        itemTotal: response.page?.item_total || 0,
        hasNext: response.page?.has_next || false,
      });

      const wishlistData = wishlistObject(response?.documents || []);
      setWishlists((prev) => [...prev, ...wishlistData]);
    } catch (error) {
      console.error("Error loading more wishlists:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    paginationInfo.hasNext,
    currentPage,
    fetchAllWishlists,
    wishlistObject,
  ]);

  const handleIntersection = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && paginationInfo.hasNext && !isLoadingMore) {
        loadMoreWishlists();
      }
    },
    [paginationInfo.hasNext, isLoadingMore, loadMoreWishlists]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef && isOpen) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection, isOpen]);

  const productImage = (wishlist) => {
    try {
      const items = wishlist?.cart?.items || [];
      const images = items.flatMap((item) => {
        const product = item?.product;
        if (product?.images && Array.isArray(product.images)) {
          const firstValid = product.images.find((img) => img?.url)?.url;
          return firstValid ? [firstValid] : [];
        }
        return [];
      });

      return images.slice(0, 4);
    } catch (error) {
      console.error("Error processing product images:", error);
      return [];
    }
  };

  const fetchWishlists = async (isLoadingMoreData = false) => {
    try {
      if (isLoadingMoreData) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setWishlists([]);
        setCurrentPage(1);
      }

      const pageToLoad = isLoadingMoreData ? currentPage : 1;
      const response = await fetchAllWishlists(pageToLoad, pageSize);

      setPaginationInfo({
        current: response?.page?.current || 1,
        total: response?.page?.total || 1,
        itemTotal: response?.page?.item_total || 0,
        hasNext: response?.page?.has_next || false,
      });

      const wishlistData = wishlistObject(response?.documents || []);

      if (isLoadingMoreData) {
        setWishlists((prev) => [...prev, ...wishlistData]);
      } else {
        setWishlists(wishlistData);
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      if (!isLoadingMoreData) {
        setWishlists([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
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
                  <>
                    {wishlists.map((wishlist) => (
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
                                      <img
                                        src={item}
                                        alt={"Wishlist Image"}
                                        width={45}
                                        height={45}
                                      />
                                      {isLastVisible && (
                                        <div
                                          className={styles.moreImagesOverlay}
                                        >
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
                    ))}

                    {isLoadingMore && (
                      <>
                        {Array.from(
                          { length: getLoadingMoreShimmerCount() || 3 },
                          (_, index) => (
                            <div
                              key={`loading-${index}`}
                              className={styles.wishlistItemShimmer}
                            >
                              <div className={styles.shimmerCheckbox}></div>
                              <div className={styles.shimmerInfo}>
                                <div className={styles.shimmerName}></div>
                                <div className={styles.shimmerMeta}></div>
                              </div>
                              <div className={styles.shimmerPreview}>
                                <div className={styles.shimmerImage}></div>
                                <div className={styles.shimmerImage}></div>
                              </div>
                            </div>
                          )
                        )}
                      </>
                    )}

                    {paginationInfo.hasNext && !isLoadingMore && (
                      <div ref={loadMoreRef} style={{ height: "1px" }} />
                    )}
                  </>
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
  handleOpenCreateWishlistModal: PropTypes.func,
};

export default SaveToWishlistModal;

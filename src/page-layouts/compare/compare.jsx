import React from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import ProductCard from "../../components/product-card/product-card";
import FyImage from "../../components/core/fy-image/fy-image";
import * as styles from "./compare.less";
import { useGlobalTranslation } from "fdk-core/utils";

function Compare({
  isLoading,
  products = [],
  attributes = [],
  category,
  showSearch,
  searchLoading,
  searchText,
  setSearchText,
  filteredSuggestions,
  cardProps = {
    isSaleBadge: false,
    isWishlistIcon: false,
    isImageFill: false,
  },
  imagePlaceholder = "",
  loader = <></>,
  setShowSearch = () => { },
  handleAdd = () => { },
  handleRemove = () => { },
  handleInputChange = () => { },
  isDifferentAttr = () => { },
  getAttribute = () => { },
  checkHtml = () => { },
}) {
  const { t } = useGlobalTranslation("translation");
  return (
    <div className={styles.compare}>
      <div className={`${styles.compare__breadcrumbs} ${styles.captionNormal}`}>
        <span>
          <FDKLink to="/">{t("resource.common.breadcrumb.home")}</FDKLink>&nbsp; / &nbsp;
        </span>
        <span>
          <FDKLink to="/products">{t("resource.common.breadcrumb.products")}</FDKLink>&nbsp; / &nbsp;
        </span>
        {category?.name && category?.url && (
          <span>
            <FDKLink to={category?.url}>{category?.name}</FDKLink>
            &nbsp; / &nbsp;
          </span>
        )}
        <span className={styles.active}>{t("resource.compare.compare_products")}</span>
      </div>
      <h1 className={`${styles.compare__title} fontHeader`}>
        {t("resource.compare.add_products_to_compare")}
      </h1>
      {isLoading ? (
        loader
      ) : (
        <>
          {" "}
          {!showSearch ? (
            <div className={styles.compareContainer}>
              <div className={styles.productList}>
                <div className={styles.emptyStateCont}>
                  {(products?.length < 4 || products?.length === 0) && (
                    <div
                      className={styles.emptyBox}
                      onClick={() => {
                        setShowSearch(true);
                        setSearchText("");
                      }}
                    >
                      <SvgWrapper svgSrc="compare-arrow" />
                      <div>{t("resource.compare.add_products_to_compare")}</div>
                    </div>
                  )}
                </div>
                {products?.length > 0 &&
                  products.map((item, index) => (
                    <div key={index} className={styles.product}>
                      <div
                        className={styles.crossBtn}
                        onClick={() => handleRemove(item.slug)}
                      >
                        <SvgWrapper svgSrc="close" />
                      </div>

                      <FDKLink to={`/product/${item.slug}`}>
                        <ProductCard
                          product={item}
                          {...cardProps}
                          imagePlaceholder={imagePlaceholder}
                        />
                      </FDKLink>
                    </div>
                  ))}
              </div>

              <div className={styles.attributeList}>
                {products.length > 0 && (
                  <div className={styles.attribute}>
                    {attributes?.map((attributesMetadata, id) => (
                      <div
                        key={id}
                        style={{ "--cell-width": products?.length + 1 }}
                      >
                        <div className={styles.compareTitle}>
                          <div> {attributes[id].title}</div>
                        </div>
                        {attributesMetadata.details.map((attribute, aid) => (
                          <div
                            key={`cl${id}${aid}`}
                            className={styles.attrListWrap}
                          >
                            <div
                              className={`${styles.attrName} ${styles.alignAttribute} ${isDifferentAttr(attribute) ? styles.differ : ""
                                }`}
                            >
                              {attribute.display}
                            </div>
                            {products.map((cProduct, idx) => (
                              <div
                                key={`cp${idx}`}
                                className={`${styles.attrDescName} ${styles.alignAttribute}`}
                              >
                                {checkHtml(
                                  getAttribute(cProduct, attribute)
                                ) ? (
                                  <span
                                    className={styles.attr}
                                    style={{ textAlign: "start" }}
                                    dangerouslySetInnerHTML={{
                                      __html: getAttribute(cProduct, attribute),
                                    }}
                                  />
                                ) : (
                                  <span className={styles.attr}>
                                    {getAttribute(cProduct, attribute)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {products?.length >= 4 && (
                <div className={`${styles.errorMessage} ${styles.attr}`}>
                  *{t("resource.compare.max_four_products_allowed")}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.addSearchContainer}>
              <div className={styles.searchBox}>
                <div className={styles.searchBlock}>
                  <div className={styles.searchHeader}>
                    <div className={styles.addSearchTitle}>{t("resource.common.search_here")}</div>
                    {products?.length > 0 && (
                      <div
                        className={styles.crossBtn}
                        onClick={() => setShowSearch(false)}
                      >
                        <SvgWrapper svgSrc="close" />
                      </div>
                    )}
                  </div>
                  <div className={styles.searchContainer}>
                    <input
                      className={styles.inputBox}
                      type="text"
                      defaultValue={searchText}
                      onChange={(e) => handleInputChange(e?.target?.value)}
                      placeholder={t("resource.compare.search_product_here")}
                    />
                    <SvgWrapper
                      svgSrc="search-black"
                      className={styles.searchIcon}
                    />
                  </div>

                  <div className={styles.compareItems}>
                    <div className={styles.popularhdng}>{t("resource.compare.add_to_compare")}</div>
                    {searchLoading ? (
                      <div className={styles.loading}>{t("resource.common.loading")}</div>
                    ) : (
                      <>
                        {filteredSuggestions?.length > 0 ? (
                          <div
                            className={`${styles.landingBestsellerHandest} ${styles.searchResults}`}
                          >
                            {filteredSuggestions.map((data, index) => (
                              <div
                                key={index}
                                className={styles.whiteSmallRBox}
                              >
                                <div
                                  className={styles.media}
                                  onClick={() => {
                                    handleAdd(data.slug);
                                    setShowSearch(false);
                                  }}
                                >
                                  <div className={styles.mediaLeft}>
                                    <FyImage
                                      className={styles.fill}
                                      src={data?.media?.[0]?.url}
                                      alt={data?.media?.[0]?.alt}
                                      sources={[{ width: 55 }]}
                                      placeholder={imagePlaceholder}
                                    />
                                  </div>
                                  <div className={styles.mediaLeftName}>
                                    {data.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={styles.notFound}>
                            {t("resource.common.no_product_found")}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div >
  );
}

export default Compare;

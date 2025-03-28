import React from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import ProductCard from "../../components/product-card/product-card";
import FyImage from "../../components/core/fy-image/fy-image";
import * as styles from "./compare.less";

function Compare({
  isLoading,
  products = [],
  attributes = [],
  category,
  showSearch,
  searchText,
  filteredSuggestions,
  cardProps = {
    isSaleBadge: false,
    isWishlistIcon: false,
    isImageFill: false,
  },
  imagePlaceholder = "",
  loader = <></>,
  setShowSearch = () => {},
  handleAdd = () => {},
  handleRemove = () => {},
  handleInputChange = () => {},
  isDifferentAttr = () => {},
  getAttribute = () => {},
  checkHtml = () => {},
}) {
  return (
    <div className={styles.compare}>
      <div className={`${styles.compare__breadcrumbs} ${styles.captionNormal}`}>
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span>
          <FDKLink to="/products">Products</FDKLink>&nbsp; / &nbsp;
        </span>
        {category?.name && category?.url && (
          <span>
            <FDKLink to={category?.url}>{category?.name}</FDKLink>
            &nbsp; / &nbsp;
          </span>
        )}
        <span className={styles.active}>Compare Products</span>
      </div>
      <h1 className={`${styles.compare__title} fontHeader`}>
        Add Products to Compare
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
                      }}
                    >
                      <SvgWrapper svgSrc="compare-arrow" />
                      <div>Add Products To Compare</div>
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
                              className={`${styles.attrName} ${styles.alignAttribute} ${
                                isDifferentAttr(attribute) ? styles.differ : ""
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
                                    style={{ textAlign: "left" }}
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
                  *You can only add four products at a time
                </div>
              )}
            </div>
          ) : (
            <div className={styles.addSearchContainer}>
              <div className={styles.searchBox}>
                <div className={styles.searchBlock}>
                  <div className={styles.searchHeader}>
                    <div className={styles.addSearchTitle}>Search Here</div>
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
                      placeholder="Search Product here"
                    />
                    <SvgWrapper
                      svgSrc="search-black"
                      className={styles.searchIcon}
                    />
                  </div>

                  <div className={styles.compareItems}>
                    <div className={styles.popularhdng}>Add to compare</div>

                    {filteredSuggestions?.length > 0 ? (
                      <div
                        className={`${styles.landingBestsellerHandest} ${styles.searchResults}`}
                      >
                        {filteredSuggestions.map((data, index) => (
                          <div key={index} className={styles.whiteSmallRBox}>
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
                      <div className={styles.notFound}>No Product Found</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Compare;

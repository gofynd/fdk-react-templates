import { useEffect, useState, useMemo, useCallback } from "react";
//@ts-expect-error
import { useGlobalStore } from "fdk-core/utils";
import { useLocation, useNavigate, createSearchParams } from "react-router-dom";
import { SINGLE_FILTER_VALUES } from "../../helper/constant";
import { throttle, updateGraphQueryWithValue } from "../../helper/utils";
import { PLP_LIST } from "../../queries/plpQuery";

let isProductListingMounted = false;

const useProductListing = (fpi) => {
  const THEME = useGlobalStore(fpi.getters.THEME);
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const listing_price =
    CONFIGURATION?.app_features?.common?.listing_price?.value || "range";
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "product-listing")?.settings?.props ||
    {};
  // const pageConfig =
  //   THEME?.config?.list[0]?.page?.find((f) => f.page === "product-listing")
  //     ?.settings?.props || {};

  const location = useLocation();
  const [queryParams, setQueryParams] = useState(
    new URLSearchParams(location.search)
  );
  const [filterParams, setFilterParams] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    let p = new URLSearchParams(location.search);
    setQueryParams(p);
    if (queryParams.has("page_no")) {
      setPageNo(parseInt(p.get("page_no")));
    }
  }, [location.search]);

  const [selectedfilters, setSelectedFilters] = useState(() => {
    const tempSelected = {};
    queryParams?.forEach((value, key) => {
      if (!SINGLE_FILTER_VALUES[key]) {
        if (tempSelected[key] && !tempSelected[key][value]) {
          tempSelected[key][value] = true;
        } else if (!tempSelected[key]) {
          tempSelected[key] = {};
          tempSelected[key][value] = true;
        }
      }
    });
    return tempSelected;
  });
  const [currentSort, setCurrentSort] = useState(() => {
    let sortDefaultValue = queryParams.get("sort_on") ?? null;
    return sortDefaultValue;
  });
  const [pageNo, setPageNo] = useState(() => {
    let defaultPageNo = queryParams.get("page_no") ?? 1;
    return defaultPageNo;
  });
  const [pageData, setPageData] = useState({});
  const PAGE_SIZE = 12;
  const navigate = useNavigate();
  let product_lists = useGlobalStore(fpi?.getters?.PRODUCTS);
  // const [product_lists, setProductList] = useState(null);

  useEffect(() => {
    // setApiLoading(true);

    const values = [
      ["$pageNo", `${pageNo}`],
      ["$pageType", `"number"`],
    ];
    if (currentSort !== null) {
      values.push(["$sortOn", `"${currentSort}"`]);
    } else {
      values.push(["$sortOn", `""`]);
    }
    if (filterParams.length) {
      values.push(["$filterQuery", `"${filterParams}"`]);
    } else {
      values.push(["$filterQuery", `""`]);
    }
    fpi
      .executeGraphQL(updateGraphQueryWithValue(PLP_LIST, values))
      .then((res) => {
        // console.log(res?.products);
        // setProductList(res?.products);
        setApiLoading(false);
      });
    setApiLoading(false);
  }, [currentSort, pageNo]);

  useEffect(() => {
    // setApiLoading(true);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page_no", "1");
    setPageNo(1);
    const values = [
      ["$pageNo", `${1}`],
      ["$pageType", `"number"`],
    ];
    if (currentSort !== null) {
      values.push(["$sortOn", `"${currentSort}"`]);
    } else {
      values.push(["$sortOn", `""`]);
    }
    if (filterParams.length) {
      values.push(["$filterQuery", `"${filterParams}"`]);
    } else {
      values.push(["$filterQuery", `""`]);
    }
    fpi
      .executeGraphQL(updateGraphQueryWithValue(PLP_LIST, values))
      .then((res) => {
        // setProductList(res?.products);
        setApiLoading(false);
      });
  }, [filterParams]);

  // const updateSelectedFilters = throttle(() => {
  //   let par = new URLSearchParams(location.search);
  //   for (const [key, value] of par.entries()) {
  //     console.log(`${key}, ${value}`);
  //   }
  // }, 1400);

  function appendDelimiter(queryString) {
    const searchParams = new URLSearchParams(queryString);
    const params = Array.from(searchParams.entries());

    // Check if there's only one parameter
    if (params.length === 1) {
      const [key, value] = params[0];
      if (key !== "page_no" && key !== "sort_on") {
        return `${key}:${value}`;
      }
      return ``;
    }

    // Append ::: to each parameter except the last one
    const result = params.map(([key, value], index) => {
      if (key !== "page_no" && key !== "sort_on") {
        if (index === params.length - 1) {
          return `${key}:${value}`;
        } else {
          return `${key}:${value}:::`;
        }
      }
    });

    return result.join("");
  }

  const updateSelectedFilters = () => {
    let par = window.location.search;
    let filterQuery = appendDelimiter(par);

    setFilterParams(filterQuery);
  };

  return {
    product_lists,
    selectedfilters,
    pageNo,
    currentSort,
    updateSelectedFilters,
    setPageNo,
    setCurrentSort,
    globalConfig,
    pageConfig,
    listing_price,
    pageData,
    apiLoading,
  };
};

export default useProductListing;

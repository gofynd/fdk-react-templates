//@ts-expect-error
import { getPageSlug } from "fdk-core/utils";
import {
  APP_CONFIG,
  APP_CONTENT_LANDING_SEO,
  APP_DETAILS,
  LIB_QUERY,
  PLATFORM_CONFIG,
  THEME_PAGE_DETAILS,
  USER_DATA_QUERY,
} from "../queries/libQuery";
import { updateGraphQueryWithValue } from "./utils";

export async function globalDataResolver({ fpi, applicationID }) {
  // console.log(applicationID);
  // return Promise.all([
  //     fpi.configuration.fetchApplication(),
  //     fpi.content.fetchLandingPage(),
  //     fpi.content.fetchAppSeo(),
  //     fpi.content?.fetchTags(),
  //     fpi.auth?.fetchPlatformData({id:applicationID}),
  // ]).catch(console.log);
}

export async function pageDataResolver({ fpi, router, themeId }) {
  const state = fpi.store.getState();
  const pageValue = getPageSlug(router);
  fpi.executeGraphQL(USER_DATA_QUERY);
  //   const APIs = [fpi.auth?.fetchUserData()];
  const APIs = [];

  const currentPageInStore = state?.theme?.page?.themePageDetail?.value ?? null;

  // console.log("Page Data resolver called with : ", {
  //   fpi,
  //   router,
  //   state,
  //   pageValue,
  //   currentPageInStore,
  // });
  // console.log("ThemeId and PageValue : ", {
  //   currentPageInStore,
  //   pageValue,
  // });

  if (pageValue && pageValue !== currentPageInStore) {
    // APIs.push(
    //   fpi.theme.fetchPage({
    //     pageValue,
    //     themeId,
    //   })
    // );
    const values = [
      ["$themeId", `"${themeId}"`],
      ["$pageValue", `"${pageValue}"`],
    ];
    APIs.push(fpi.executeGraphQL(updateGraphQueryWithValue(LIB_QUERY, values)));
  }
  return Promise.all(APIs).catch(console.log);
}

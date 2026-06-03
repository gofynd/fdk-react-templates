import { useFPI } from "fdk-core/utils";
import { getLocaleDirection } from "../utils";

const useLocaleDirection = () => {
  const fpi = useFPI();
  const direction = getLocaleDirection(fpi);
  const isRTL = direction === "rtl";

  return { isRTL, direction };
};

export default useLocaleDirection;

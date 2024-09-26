//@ts-expect-error
import { useGlobalStore } from "fdk-core/utils";
import Snackbar from "awesome-snackbar";

export function useLoggedInUser(fpi) {
  return {
    userData: useGlobalStore(fpi.getters.USER_DATA),
    loggedIn: useGlobalStore(fpi.getters.LOGGED_IN),
    userFetch: useGlobalStore(fpi.getters.USER_FETCHED),
  };
}

const getBgColor = (type) => {
  if (type === "success") {
    return "var(--successBackground)";
  } else if (type === "error") {
    return "var(--errorBackground)";
  }
  return "var(--informationBackground)";
};

const getColor = (type) => {
  if (type === "success") {
    return "var(--successText)";
  } else if (type === "error") {
    return "var(--errorText)";
  }
  return "var(--informationText)";
};

const useSnackbar = () => {
  const showSnackbar = (message, type) => {
    new Snackbar(`${message}`, {
      position: "top-center",
      // actionText: "Undo",
      style: {
        container: [
          ["background-color", getBgColor(type)],
          ["margin-top", "80px"],
          // ["border", `1px solid ${getColor(type)}`],
        ],
        message: [["color", getColor(type)]],
        bold: [["font-weight", "bold"]],
        actionButton: [["color", "white"]],
      },
    });
  };

  return { showSnackbar };
};

export default useSnackbar;

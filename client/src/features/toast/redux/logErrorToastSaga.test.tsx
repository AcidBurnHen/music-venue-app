import { expectSaga } from "redux-saga-test-plan";

import { ToastOptions } from "../types";
import { logErrorToast, logErrorToasts } from "./LogErrorToastSaga";

const errorToastOptions: ToastOptions = {
  title: "It's time to panic!",
  status: "error",
};

const errorToastAction = {
  type: "test",
  payload: errorToastOptions,
};

test("saga calls analytics when it recieves error taost", () => {
  return expectSaga(logErrorToasts, errorToastAction)
    .call(logErrorToast, "It's time to panic!")
    .run();
});

const infoToastOptions: ToastOptions = {
  title: "It's not time to panic",
  status: "info",
};

const infoToastAction = {
  type: "test",
  payload: infoToastOptions,
};

test("saga does not call analytics when it receives info toast", () => {
  return expectSaga(logErrorToasts, infoToastAction)
    .not.call.fn(logErrorToast)
    .run();
});

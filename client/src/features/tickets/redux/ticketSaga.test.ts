import { PayloadAction } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { SagaIterator } from "redux-saga";
import {
  call,
  cancel,
  cancelled,
  put,
  race,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan";
import { throwError } from "redux-saga-test-plan/providers";

import { HoldReservation } from "../../../../../shared/types";
import {
  holdReservation,
  purchasePayload,
  purchaseReservation,
} from "../../../test-utils/fake-data";
import { showToast } from "../../toast/redux/toastSlice";
import { ToastOptions } from "../../toast/types";
import {
  cancelPurchaseServerCall,
  releaseServerCall,
  reserveTicketServerCall,
} from "../api";
import { TicketAction } from "../types";
import { generateErrorToastOptions, ticketFlow } from "./ticketSaga";
import {
  endTransaction,
  holdTickets,
  PurchasePayload,
  ReleasePayload,
  resetTransaction,
  selectors,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from "./ticketSlice";

const holdAction = {
  type: "test",
  payload: holdReservation,
};

describe("common to all flows", () => {
  test("starts with hold call to server", () => {
    expectSaga(ticketFlow, holdAction)
      .provide([
        [matchers.call.fn(reserveTicketServerCall), null],
        [matchers.call.fn(releaseServerCall), null],
      ])
      .dispatch(
        startTicketAbort({ reservation: holdReservation, reason: "Abort" })
      )
      .call(reserveTicketServerCall, holdReservation)
      .run();
  });

  test("show error toast and clean up after server error", () => {
    return expectSaga(ticketFlow, holdAction)
      .provide([
        [
          matchers.call.fn(reserveTicketServerCall),
          throwError(new Error("it did not work")),
        ],
        [
          matchers.select.selector(selectors.getTicketAction),
          TicketAction.hold,
        ],
        [matchers.call.fn(releaseServerCall), null],
      ])
      .put(
        showToast(
          generateErrorToastOptions("it did not work", TicketAction.hold)
        )
      );
  });
});

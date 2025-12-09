import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.successPayment(
      query as Record<string, string>
    );

    if (result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
      );
    }
  }
);

const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.failPayment(
      query as Record<string, string>
    );

    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
      );
    }
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.cancelPayment(
      query as Record<string, string>
    );

    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
      );
    }
  }
);

const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    const result = await PaymentServices.initPayment(orderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Payment completed successfully.",
      data: result
    });
  }
);

export const PaymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
};

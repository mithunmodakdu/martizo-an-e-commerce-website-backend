import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios";
import httpStatusCodes from "http-status-codes";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASS,
      total_amount: payload.total_amount,
      currency: "BDT",
      tran_id: payload.tran_id,

      success_url: envVars.SSL.SSL_SUCCESS_BACKEND_URL,
      fail_url: envVars.SSL.SSL_FAIL_BACKEND_URL,
      cancel_url: envVars.SSL.SSL_CANCEL_BACKEND_URL,

      emi_option: 0,

      product_name: payload.product_name,
      product_category: payload.product_category,
      product_profile: "general",

      cus_name: payload.cus_name,
      cus_email: payload.cus_email,
      cus_add1: payload.cus_add1,
      cus_add2: "N/A",
      cus_city: payload.cus_city,
      cus_state: "N/A",
      cus_postcode: payload.cus_postcode,
      cus_country: payload.cus_country,
      cus_phone: payload.cus_phone,

  
      
    };

    console.log(data);

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_SESSION_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    throw new AppError(httpStatusCodes.BAD_REQUEST, error.message)
    // throw error;
  }
};

export const SSLCommerzServices = {
  sslPaymentInit,
};


export interface IOffer {
  offerType: "TODAYS_OFFER" | "CLEARANCE" | "VOUCHER" | "BUNDLE" | "FLASH_SALE";
  discountPercentage?: number;
  startDate?: Date;
  endDate?: Date;
  voucherCode?: string;
}

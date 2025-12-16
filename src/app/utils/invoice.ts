/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { IShippingAddress } from "../modules/order/order.interface";

export interface ICustomerInfo {
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
}

export interface IInvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

export interface IInvoiceData {
  invoiceNo: string;
  date: string | Date;

  customerInfo: ICustomerInfo;
  shippingInfo: IShippingAddress;

  items: IInvoiceItem[];

  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

const tableRow = (
  doc: PDFKit.PDFDocument,
  y: number,
  item: string,
  price: string,
  qty: number | string,
  total: string,
  header = false
) => {
  doc.font(header ? "Helvetica-Bold" : "Helvetica").fontSize(10);
  doc.text(item, 70, y);
  doc.text(price, 250, y, { width: 70, align: "right" });
  doc.text(qty.toString(), 350, y, { width: 70, align: "right" });
  doc.text(total, 450, y, { width: 70, align: "right" });
};

const drawLine = (doc: PDFKit.PDFDocument, y: number) => {
  doc.strokeColor("#aaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = (amount: number) => {
  return `Tk. ${amount.toFixed(2)}`;
};

export const generateInvoicePDF = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // :::: PDF Content ::::

      // HEADER

      doc
        .fontSize(20)
        .text("Martizo", 50, 45)
        .fontSize(10)
        .text("www.martizo.com", 50, 70)
        .text("support@martizo.com");

      doc.fontSize(20).text("INVOICE", 400, 50, { align: "right" });
      doc
        .fontSize(10)
        .text(`Invoice No: ${invoiceData.invoiceNo}`, 400, 80, {
          align: "right",
        })
        .text(`Date: ${invoiceData.date}`, { align: "right" });

      // CUSTOMER INFO
      doc
        .fontSize(11)
        .text("Bill To:", 50, 125)
        .font("Helvetica-Bold")
        .text(invoiceData.customerInfo.name, 50, 140)
        .font("Helvetica")
        .text(invoiceData.customerInfo.address)
        .text(invoiceData.customerInfo.city)
        .text(`Email: ${invoiceData.customerInfo.email}`)
        .text(`Phone: ${invoiceData.customerInfo.phone}`);

      doc
        .fontSize(11)
        .text("Ship To:", 350, 125)
        .font("Helvetica-Bold")
        .text(invoiceData.shippingInfo.name, 350, 140)
        .font("Helvetica")
        .text(invoiceData.shippingInfo.address)
        .text(invoiceData.shippingInfo.city)
        .text(`Phone: ${invoiceData.shippingInfo.phone}`);

      drawLine(doc, 200);

      // TABLE HEADER
      const tableTop = 210;
      doc.font("Helvetica-Bold");
      tableRow(doc, tableTop, "Item", "Price", "Qty", "Total");
      drawLine(doc, tableTop + 15);
      doc.font("Helvetica");

      // TABLE ROWS
      let position = tableTop + 30;
      invoiceData.items.forEach((item) => {
        tableRow(
          doc,
          position,
          item.name,
          formatCurrency(item.price),
          item.quantity,
          formatCurrency(item.price * item.quantity)
        );
        position += 20;
      });

      drawLine(doc, position + 5);

      // TOTALS
      const totalsTop = position + 25;
      doc
        .font("Helvetica")
        .text("Subtotal", 400, totalsTop, { width: 50, align: "right" })
        .text(formatCurrency(invoiceData.subtotal), 450, totalsTop, {
          align: "right",
        });

      doc
        .text("Shipping", 400, totalsTop + 15, { width: 50, align: "right" })
        .text(formatCurrency(invoiceData.shippingCost), 450, totalsTop + 15, {
          align: "right",
        });

      doc
        .text("Tax", 400, totalsTop + 30, { width: 50, align: "right" })
        .text(formatCurrency(invoiceData.tax), 450, totalsTop + 30, {
          align: "right",
        });

      doc
        .font("Helvetica-Bold")
        .text("Total", 400, totalsTop + 50, { width: 50, align: "right" })
        .text(formatCurrency(invoiceData.total), 450, totalsTop + 50, {
          align: "right",
        });

      // FOOTER
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Thank you for shopping with Martizo!", 50, totalsTop + 150, {
          align: "center",
        });

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      `generate Invoice PDF error: ${error.message}`
    );
  }
};


// {
//   invoiceNo: "DH-1023",
//   date: "16 Dec 2025",
//   customerInfo: {
//     name: "Mithun Kumer Modak",
//     email: "mithun@email.com",
//     address: "Dhaka, Bangladesh",
//     city: "Dhaka",
//     phone: "01919834450"
//   },
//   shippingInfo: {
//     name: "Mithun Kumer Modak",
//     address: "Mirpur, Dhaka",
//     city: "Dhaka",
//     phone: "01919834450"
//   },
//   items: [
//     { name: "Samsung Galaxy A34", price: 45000, quantity: 1 },
//     { name: "Cotton Blanket", price: 2500, quantity: 2 },
//   ],
//   subtotal: 50000,
//   shippingCost: 100,
//   tax: 500,
//   total: 50600,
// }

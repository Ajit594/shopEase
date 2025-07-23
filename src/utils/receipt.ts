import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CartItem } from '@/contexts/CartContext';
import { CheckoutFormData } from '@/components/checkout/CheckoutForm';

interface TableRowData {
  [key: number]: string | number;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: unknown) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export interface OrderDetails {
  orderId: string;
  orderDate: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingInfo: CheckoutFormData;
  paymentMethod: string;
}

// Create a text-based receipt that can be displayed directly in the browser
export const generateTextReceipt = (orderDetails: OrderDetails): string => {
  // Format date properly
  const formattedDate = new Date(orderDetails.orderDate).toLocaleDateString();
  
  // Build receipt header
  let receipt = `
==============================================
                  SHOPEASE
                Purchase Receipt
==============================================

Order ID: ${orderDetails.orderId}
Date: ${formattedDate}
Payment Method: ${orderDetails.paymentMethod}

----------------------------------------------
CUSTOMER INFORMATION
----------------------------------------------
Name: ${orderDetails.shippingInfo.fullName}
Email: ${orderDetails.shippingInfo.email}
Phone: ${orderDetails.shippingInfo.phone}

----------------------------------------------
SHIPPING ADDRESS
----------------------------------------------
${orderDetails.shippingInfo.address}
${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state} ${orderDetails.shippingInfo.zipCode}
${orderDetails.shippingInfo.country}

----------------------------------------------
ORDER DETAILS
----------------------------------------------
`;

  // Add items
  receipt += `${'ITEM'.padEnd(30)} ${'QTY'.padStart(5)} ${'PRICE'.padStart(10)} ${'TOTAL'.padStart(10)}\n`;
  receipt += `${''.padEnd(55, '-')}\n`;
  
  orderDetails.items.forEach((item) => {
    const name = item.name.length > 27 ? item.name.substring(0, 24) + '...' : item.name;
    receipt += `${name.padEnd(30)} ${item.quantity.toString().padStart(5)} $${item.price.toFixed(2).padStart(9)} $${(item.price * item.quantity).toFixed(2).padStart(9)}\n`;
  });
  
  // Add totals
  receipt += `${''.padEnd(55, '-')}\n`;
  receipt += `${'Subtotal:'.padEnd(45)} $${orderDetails.subtotal.toFixed(2).padStart(8)}\n`;
  receipt += `${'Tax:'.padEnd(45)} $${orderDetails.tax.toFixed(2).padStart(8)}\n`;
  
  const shippingText = orderDetails.shipping === 0 ? 'Free' : `$${orderDetails.shipping.toFixed(2)}`;
  receipt += `${'Shipping:'.padEnd(45)} ${shippingText.padStart(8)}\n`;
  receipt += `${''.padEnd(55, '-')}\n`;
  receipt += `${'TOTAL:'.padEnd(45)} $${orderDetails.total.toFixed(2).padStart(8)}\n`;
  receipt += `
==============================================
      Thank you for shopping with ShopEase!
     This is a demo receipt for illustration purposes.
==============================================
`;

  return receipt;
};

export const generateReceipt = (orderDetails: OrderDetails): string => {
  try {
    // First try to generate PDF receipt
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo or company name
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("ShopEase", pageWidth / 2, 20, { align: "center" });
    
    // Add receipt title
    doc.setFontSize(16);
    doc.text("Purchase Receipt", pageWidth / 2, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 35, pageWidth - 15, 35);
    
    // Add order details
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Order ID: ${orderDetails.orderId}`, 15, 45);
    doc.text(`Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}`, 15, 50);
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 15, 55);
    
    // Add customer details
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Customer Information", 15, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Name: ${orderDetails.shippingInfo.fullName}`, 15, 72);
    doc.text(`Email: ${orderDetails.shippingInfo.email}`, 15, 77);
    doc.text(`Phone: ${orderDetails.shippingInfo.phone}`, 15, 82);
    
    // Add shipping address
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Shipping Address", 15, 92);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(orderDetails.shippingInfo.address, 15, 99);
    doc.text(
      `${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state} ${orderDetails.shippingInfo.zipCode}`, 
      15, 
      104
    );
    doc.text(orderDetails.shippingInfo.country, 15, 109);
    
    // Add product table
    const tableColumn = ["#", "Product", "Qty", "Price", "Total"];
    const tableRows: TableRowData[] = [];
    
    orderDetails.items.forEach((item, index) => {
      const productData = [
        index + 1,
        item.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ];
      tableRows.push(productData);
    });
    
    doc.autoTable({
      startY: 120,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      }
    });
    
    const finalY = doc.lastAutoTable.finalY || 150;
    
    // Add summary
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    doc.text(`Subtotal:`, pageWidth - 60, finalY + 10);
    doc.text(`$${orderDetails.subtotal.toFixed(2)}`, pageWidth - 15, finalY + 10, { align: "right" });
    
    doc.text(`Tax:`, pageWidth - 60, finalY + 15);
    doc.text(`$${orderDetails.tax.toFixed(2)}`, pageWidth - 15, finalY + 15, { align: "right" });
    
    doc.text(`Shipping:`, pageWidth - 60, finalY + 20);
    doc.text(
      orderDetails.shipping === 0 ? "Free" : `$${orderDetails.shipping.toFixed(2)}`, 
      pageWidth - 15, 
      finalY + 20, 
      { align: "right" }
    );
    
    // Add horizontal line before total
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 70, finalY + 25, pageWidth - 15, finalY + 25);
    
    // Add total
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text(`Total:`, pageWidth - 60, finalY + 32);
    doc.text(`$${orderDetails.total.toFixed(2)}`, pageWidth - 15, finalY + 32, { align: "right" });
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont(undefined, 'normal');
    doc.text("Thank you for shopping with ShopEase!", pageWidth / 2, footerY, { align: "center" });
    doc.text("This is a demo receipt for illustration purposes.", pageWidth / 2, footerY + 5, { align: "center" });
    
    // Return data URL for download
    return doc.output('datauristring');
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    
    // Return a text-based receipt as fallback
    const textReceipt = generateTextReceipt(orderDetails);
    return `data:text/plain;charset=utf-8,${encodeURIComponent(textReceipt)}`;
  }
};

export const downloadReceipt = (dataUrl: string, orderId: string) => {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    
    // Determine file type from data URL
    const isPdf = dataUrl.startsWith('data:application/pdf') || dataUrl.includes('pdf');
    link.download = `receipt-${orderId}${isPdf ? '.pdf' : '.txt'}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading receipt:", error);
    
    // Show receipt in a new tab as a last resort
    try {
      window.open(dataUrl, '_blank');
    } catch (e) {
      console.error("Failed to open receipt in new tab:", e);
      alert("Receipt download failed. Please try again later.");
    }
  }
};

// Function to view receipt in the browser
export const viewReceiptInBrowser = (orderDetails: OrderDetails) => {
  const textReceipt = generateTextReceipt(orderDetails);
  
  // Open in a new window with pre-formatted text
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order ${orderDetails.orderId}</title>
        <style>
          body {
            font-family: monospace;
            white-space: pre;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          @media print {
            body {
              background-color: white;
            }
            .receipt-container {
              box-shadow: none;
              border: none;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          ${textReceipt}
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Print Receipt</button>
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();
  }
};
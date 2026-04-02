import { Injectable } from '@nestjs/common';

export interface InvoiceInfo {
  type: 'order' | 'vip-upgrade';
  userId?: string;
  originalInvoice: string;
}

@Injectable()
export class InvoiceService {
  createOrderInvoice(): string {
    return `INV-${Date.now()}`;
  }

  createVipUpgradeInvoice(userId: string): string {
    return `INV-VIP-${userId}-${Date.now()}`;
  }

  parse(invoice: string): InvoiceInfo {
    if (invoice.startsWith('INV-VIP-')) {
      const payloadStr = invoice.split('INV-VIP-')[1];
      if (payloadStr) {
        const lastDashIndex = payloadStr.lastIndexOf('-');
        const userId = payloadStr.substring(0, lastDashIndex);
        return {
          type: 'vip-upgrade',
          userId,
          originalInvoice: invoice,
        };
      }
    }
    
    if (invoice.startsWith('INV-')) {
      return {
        type: 'order',
        originalInvoice: invoice,
      };
    }
    
    throw new Error('Invalid invoice format');
  }

  isVipUpgradeInvoice(invoice: string): boolean {
    return invoice.startsWith('INV-VIP-');
  }
}

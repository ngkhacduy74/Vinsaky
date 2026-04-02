import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sepaySignature } from 'src/common/shared/function/sepay-sign';

export interface SepayCheckoutFields {
  merchant: string;
  operation: string;
  payment_method: string;
  order_amount: string;
  currency: string;
  order_invoice_number: string;
  order_description: string;
  customer_id: string;
  success_url: string;
  error_url: string;
  cancel_url: string;
}

export interface SepayIpnDto {
  notification_type: string;
  order: {
    order_invoice_number: string;
    order_amount: string;
  };
  transaction_id?: string;
  gateway_transaction_id?: string;
  status?: string;
  [key: string]: any;
}

@Injectable()
export class SepayService {
  constructor(private readonly config: ConfigService) {}

  private getEnvOrThrow(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
  }

  private getSepayConfig() {
    return {
      merchant: this.getEnvOrThrow('SEPAY_MERCHANT'),
      secretKey: this.getEnvOrThrow('SEPAY_SECRET_KEY'),
      baseUrl: this.getEnvOrThrow('SEPAY_BASE_URL'),
      successUrl: this.getEnvOrThrow('SEPAY_SUCCESS_URL'),
      errorUrl: this.getEnvOrThrow('SEPAY_ERROR_URL'),
      cancelUrl: this.getEnvOrThrow('SEPAY_CANCEL_URL'),
      ipnSecretKey: this.getEnvOrThrow('SEPAY_IPN_SECRET_KEY'),
    };
  }

  createCheckoutFields(invoice: string, total: number, userId?: string): SepayCheckoutFields {
    const config = this.getSepayConfig();
    
    return {
      merchant: config.merchant,
      operation: 'PURCHASE',
      payment_method: 'BANK_TRANSFER',
      order_amount: String(Math.round(total)),
      currency: 'VND',
      order_invoice_number: invoice,
      order_description: `Thanh toan don hang ${invoice}`,
      customer_id: userId ?? 'GUEST',
      success_url: `${config.successUrl}?orderCode=${invoice}`,
      error_url: `${config.errorUrl}?orderCode=${invoice}`,
      cancel_url: `${config.cancelUrl}?orderCode=${invoice}`,
    };
  }

  generateCheckoutHtml(invoice: string, total: number, userId?: string): string {
    const config = this.getSepayConfig();
    const fields = this.createCheckoutFields(invoice, total, userId);
    const signature = sepaySignature(config.secretKey, fields);
    const checkoutUrl = `${config.baseUrl}/v1/checkout/init`;

    return `
<form id="sepay" action="${checkoutUrl}" method="POST">
  ${Object.entries({ ...fields, signature })
    .map(([k, v]) => {
      const safeValue = String(v ?? '').replace(/"/g, '&quot;');
      return `<input type="hidden" name="${k}" value="${safeValue}" />`;
    })
    .join('\n')}
</form>
<script>document.getElementById('sepay').submit();</script>
`.trim();
  }

  verifyIpnSecret(headers: Record<string, any>): boolean {
    const config = this.getSepayConfig();
    const incoming = headers['x-secret-key'] || headers['X-Secret-Key'] || headers['x-secret-key'.toLowerCase()];
    
    return incoming === config.ipnSecretKey;
  }

  validateIpnBody(body: SepayIpnDto): { type: string; invoice: string; amount: number } | null {
    const type = body?.notification_type;
    const invoice = body?.order?.order_invoice_number;
    const amount = Number(body?.order?.order_amount);

    if (!type || !invoice || !Number.isFinite(amount) || amount <= 0) {
      return null;
    }

    return { type, invoice, amount };
  }
}

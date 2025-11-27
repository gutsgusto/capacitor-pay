import { WebPlugin } from '@capacitor/core';
import type { ApplePayShippingCostsUpdate, PayAvailabilityOptions, PayAvailabilityResult, PayPaymentOptions, PayPaymentResult, PayPlugin } from './definitions';
export declare class PayWeb extends WebPlugin implements PayPlugin {
    isPayAvailable(_options?: PayAvailabilityOptions): Promise<PayAvailabilityResult>;
    requestPayment(_options: PayPaymentOptions): Promise<PayPaymentResult>;
    updateShippingCosts(_options: ApplePayShippingCostsUpdate): Promise<void>;
    completeMerchantValidation(_options: {
        merchantSession: string;
    }): Promise<void>;
    getPluginVersion(): Promise<{
        version: string;
    }>;
}

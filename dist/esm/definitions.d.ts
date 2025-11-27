export declare type PayPlatform = 'ios' | 'android' | 'web';
export declare type ApplePayNetwork = 'amex' | 'chinaUnionPay' | 'discover' | 'eftpos' | 'electron' | 'girocard' | 'interac' | 'jcb' | 'mada' | 'maestro' | 'masterCard' | 'privateLabel' | 'quicPay' | 'suica' | 'visa' | 'vPay' | 'id' | 'cartesBancaires';
export declare type ApplePayMerchantCapability = '3DS' | 'credit' | 'debit' | 'emv';
export declare type ApplePaySummaryItemType = 'final' | 'pending';
export declare type ApplePayContactField = 'emailAddress' | 'name' | 'phoneNumber' | 'postalAddress';
export declare type ApplePayShippingType = 'shipping' | 'delivery' | 'servicePickup' | 'storePickup';
export interface ApplePaySummaryItem {
    label: string;
    amount: string;
    type?: ApplePaySummaryItemType;
}
export interface ApplePayAvailabilityOptions {
    /**
     * Optional list of payment networks you intend to use.
     * Passing networks determines the return value of `canMakePaymentsUsingNetworks`.
     */
    supportedNetworks?: ApplePayNetwork[];
}
export interface ApplePayAvailabilityResult {
    /**
     * Indicates whether the device can make Apple Pay payments in general.
     */
    canMakePayments: boolean;
    /**
     * Indicates whether the device can make Apple Pay payments with the supplied networks.
     */
    canMakePaymentsUsingNetworks: boolean;
}
export interface ApplePayPaymentOptions {
    /**
     * Merchant identifier created in the Apple Developer portal.
     */
    merchantIdentifier: string;
    /**
     * Two-letter ISO 3166 country code.
     */
    countryCode: string;
    /**
     * Three-letter ISO 4217 currency code.
     */
    currencyCode: string;
    /**
     * Payment summary items displayed in the Apple Pay sheet.
     */
    paymentSummaryItems: ApplePaySummaryItem[];
    /**
     * Card networks to support.
     */
    supportedNetworks: ApplePayNetwork[];
    /**
     * Merchant payment capabilities. Defaults to ['3DS'] when omitted.
     */
    merchantCapabilities?: ApplePayMerchantCapability[];
    /**
     * Contact fields that must be supplied for shipping.
     */
    requiredShippingContactFields?: ApplePayContactField[];
    /**
     * Contact fields that must be supplied for billing.
     */
    requiredBillingContactFields?: ApplePayContactField[];
    /**
     * Controls the shipping flow presented to the user.
     */
    shippingType?: ApplePayShippingType;
    /**
     * Optional ISO 3166 country codes where the merchant is supported.
     */
    supportedCountries?: string[];
    /**
     * Optional opaque application data passed back in the payment token.
     */
    applicationData?: string;
}
export interface ApplePayContact {
    name?: {
        givenName?: string;
        familyName?: string;
        middleName?: string;
        namePrefix?: string;
        nameSuffix?: string;
        nickname?: string;
    };
    emailAddress?: string;
    phoneNumber?: string;
    postalAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        isoCountryCode?: string;
        subAdministrativeArea?: string;
        subLocality?: string;
    };
}
export declare type ApplePayShippingMethodType = 'shipping' | 'delivery' | 'servicePickup' | 'storePickup' | 'pickup';
export interface ApplePayShippingMethod {
    /**
     * Unique identifier for the shipping method.
     */
    identifier: string;
    /**
     * Display label shown in the Apple Pay sheet.
     */
    label: string;
    /**
     * Cost of the shipping method as a string (e.g., "5.99").
     */
    amount: string;
    /**
     * Optional detail text describing the shipping method (e.g., "Arrives in 2-3 days").
     */
    detail?: string;
    /**
     * Type of shipping method.
     */
    type?: ApplePayShippingMethodType;
}
export interface ApplePayShippingCostsUpdate {
    /**
     * Updated payment summary items to display in the Apple Pay sheet.
     * Must include line items and a final total item.
     */
    paymentSummaryItems: ApplePaySummaryItem[];
    /**
     * Optional array of shipping methods to display for the selected address.
     */
    shippingMethods?: ApplePayShippingMethod[];
}
export interface ApplePayPaymentResult {
    /**
     * Raw payment token encoded as base64 string.
     */
    paymentData: string;
    /**
     * Raw payment token JSON string, useful for debugging.
     */
    paymentString: string;
    /**
     * Payment transaction identifier.
     */
    transactionIdentifier: string;
    paymentMethod: {
        displayName?: string;
        network?: ApplePayNetwork;
        type: 'debit' | 'credit' | 'prepaid' | 'store';
    };
    shippingContact?: ApplePayContact;
    billingContact?: ApplePayContact;
}
export declare type GooglePayEnvironment = 'test' | 'production';
export interface GooglePayAvailabilityOptions {
    /**
     * Environment used to construct the Google Payments client. Defaults to `'test'`.
     */
    environment?: GooglePayEnvironment;
    /**
     * Raw `IsReadyToPayRequest` JSON as defined by the Google Pay API.
     * Supply the card networks and auth methods you intend to support at runtime.
     */
    isReadyToPayRequest?: Record<string, unknown>;
}
export interface GooglePayAvailabilityResult {
    /**
     * Indicates whether the Google Pay API is available for the supplied parameters.
     */
    isReady: boolean;
}
export interface GooglePayPaymentOptions {
    /**
     * Environment used to construct the Google Payments client. Defaults to `'test'`.
     */
    environment?: GooglePayEnvironment;
    /**
     * Raw `PaymentDataRequest` JSON as defined by the Google Pay API.
     * Provide transaction details, merchant info, and tokenization parameters.
     */
    paymentDataRequest: Record<string, unknown>;
}
export interface GooglePayPaymentResult {
    /**
     * Payment data returned by Google Pay.
     */
    paymentData: Record<string, unknown>;
}
export interface PayAvailabilityOptions {
    apple?: ApplePayAvailabilityOptions;
    google?: GooglePayAvailabilityOptions;
}
export interface PayAvailabilityResult {
    available: boolean;
    platform: PayPlatform;
    apple?: ApplePayAvailabilityResult;
    google?: GooglePayAvailabilityResult;
}
export interface PayPaymentOptions {
    apple?: ApplePayPaymentOptions;
    google?: GooglePayPaymentOptions;
}
export interface PayPaymentResult {
    platform: Exclude<PayPlatform, 'web'>;
    apple?: ApplePayPaymentResult;
    google?: GooglePayPaymentResult;
}
export interface PayPlugin {
    /**
     * Checks whether native pay is available on the current platform.
     * On iOS this evaluates Apple Pay, on Android it evaluates Google Pay.
     */
    isPayAvailable(options?: PayAvailabilityOptions): Promise<PayAvailabilityResult>;
    /**
     * Presents the native pay sheet for the current platform.
     * Provide the Apple Pay configuration on iOS and the Google Pay configuration on Android.
     */
    requestPayment(options: PayPaymentOptions): Promise<PayPaymentResult>;
    /**
     * Updates shipping costs and payment summary during Apple Pay checkout.
     * Call this method in response to the 'applePayShippingContactSelected' event
     * to dynamically update the Apple Pay sheet with new shipping costs based on
     * the user's selected shipping address.
     *
     * @param options Updated payment summary items and optional shipping methods
     * @returns Promise that resolves when the Apple Pay sheet has been updated
     * @throws An error if no shipping contact selection is in progress
     * @since 7.2.0
     */
    updateShippingCosts(options: ApplePayShippingCostsUpdate): Promise<void>;
    /**
     * Completes the Apple Pay merchant validation process.
     * Call this method in response to the 'applePayMerchantValidation' event
     * after you've obtained a merchant session from your server.
     *
     * @param options Object containing the merchant session JSON string
     * @returns Promise that resolves when validation is complete
     * @throws An error if no merchant validation is in progress
     * @since 7.2.1
     */
    completeMerchantValidation(options: {
        merchantSession: string;
    }): Promise<void>;
    /**
     * Get the native Capacitor plugin version
     *
     * @returns {Promise<{ id: string }>} an Promise with version for this device
     * @throws An error if the something went wrong
     */
    getPluginVersion(): Promise<{
        version: string;
    }>;
    /**
     * Add a listener for Apple Pay shipping contact selection events.
     * This event fires when the user selects or changes their shipping address
     * during the Apple Pay flow. Use this to recalculate shipping costs and
     * call updateShippingCosts() with the new amounts.
     *
     * @param eventName The event name 'applePayShippingContactSelected'
     * @param listenerFunc Callback function that receives the selected shipping contact
     * @returns Promise that resolves with a listener handle for removal
     * @since 7.2.0
     */
    addListener(eventName: 'applePayShippingContactSelected', listenerFunc: (contact: ApplePayContact) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for Apple Pay shipping method selection events.
     * This event fires when the user selects or changes their shipping method
     * during the Apple Pay flow. Use this to recalculate the total cost based
     * on the selected shipping method and call updateShippingCosts() with the new amounts.
     *
     * @param eventName The event name 'applePayShippingMethodSelected'
     * @param listenerFunc Callback function that receives the selected shipping method
     * @returns Promise that resolves with a listener handle for removal
     * @since 7.2.0
     */
    addListener(eventName: 'applePayShippingMethodSelected', listenerFunc: (shippingMethod: ApplePayShippingMethod) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for Apple Pay merchant validation events.
     * This event fires when Apple Pay needs to validate your merchant.
     * You must call completeMerchantValidation() with a merchant session from your server.
     *
     * @param eventName The event name 'applePayMerchantValidation'
     * @param listenerFunc Callback function to handle merchant validation
     * @returns Promise that resolves with a listener handle for removal
     * @since 7.2.1
     */
    addListener(eventName: 'applePayMerchantValidation', listenerFunc: () => void): Promise<PluginListenerHandle>;
    /**
     * Remove all native listeners for this plugin
     */
    removeAllListeners(): Promise<void>;
}
export interface PluginListenerHandle {
    remove: () => Promise<void>;
}

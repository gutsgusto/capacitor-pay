# @capgo/capacitor-pay
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_pay"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_pay"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

Capacitor plugin to trigger native payments with Apple Pay and Google Pay using a unified JavaScript API.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/pay/

## Install

```bash
npm install @capgo/capacitor-pay
npx cap sync
```

## Platform setup

Before invoking the plugin, complete the native configuration documented in this repository:

- **Apple Pay (iOS):** see [`docs/apple-pay-setup.md`](docs/apple-pay-setup.md) for merchant ID creation, certificates, Xcode entitlements, and device testing.
- **Google Pay (Android):** follow [`docs/google-pay-setup.md`](docs/google-pay-setup.md) to configure the business profile, tokenization settings, and runtime JSON payloads.

Finish both guides once per app to unlock the native payment sheets on devices.

## Usage

```ts
import { Pay } from '@capgo/capacitor-pay';

// Check availability on the current platform.
const availability = await Pay.isPayAvailable({
  apple: {
    supportedNetworks: ['visa', 'masterCard', 'amex'],
  },
  google: {
    // Optional: falls back to a basic CARD request if omitted.
    isReadyToPayRequest: {
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
          },
        },
      ],
    },
  },
});

if (!availability.available) {
  // Surface a friendly message or provide an alternative checkout.
  return;
}

if (availability.platform === 'ios') {
  const result = await Pay.requestPayment({
    apple: {
      merchantIdentifier: 'merchant.com.example.app',
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard'],
      paymentSummaryItems: [
        { label: 'Example Product', amount: '19.99' },
        { label: 'Tax', amount: '1.60' },
        { label: 'Example Store', amount: '21.59' },
      ],
      requiredShippingContactFields: ['postalAddress', 'name', 'emailAddress'],
    },
  });
  console.log(result.apple?.paymentData);
} else if (availability.platform === 'android') {
  const result = await Pay.requestPayment({
    google: {
      environment: 'test',
      paymentDataRequest: {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
              billingAddressRequired: true,
              billingAddressParameters: {
                format: 'FULL',
              },
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId',
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: '01234567890123456789',
          merchantName: 'Example Merchant',
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: '21.59',
          currencyCode: 'USD',
          countryCode: 'US',
        },
      },
    },
  });
  console.log(result.google?.paymentData);
}
```

## API

<docgen-index>

* [`isPayAvailable(...)`](#ispayavailable)
* [`requestPayment(...)`](#requestpayment)
* [`updateShippingCosts(...)`](#updateshippingcosts)
* [`getPluginVersion()`](#getpluginversion)
* [`addListener('applePayShippingContactSelected', ...)`](#addlistenerapplepayshippingcontactselected-)
* [`addListener('applePayShippingMethodSelected', ...)`](#addlistenerapplepayshippingmethodselected-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isPayAvailable(...)

```typescript
isPayAvailable(options?: PayAvailabilityOptions | undefined) => Promise<PayAvailabilityResult>
```

Checks whether native pay is available on the current platform.
On iOS this evaluates Apple Pay, on Android it evaluates Google Pay.

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#payavailabilityoptions">PayAvailabilityOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#payavailabilityresult">PayAvailabilityResult</a>&gt;</code>

--------------------


### requestPayment(...)

```typescript
requestPayment(options: PayPaymentOptions) => Promise<PayPaymentResult>
```

Presents the native pay sheet for the current platform.
Provide the Apple Pay configuration on iOS and the Google Pay configuration on Android.

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#paypaymentoptions">PayPaymentOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#paypaymentresult">PayPaymentResult</a>&gt;</code>

--------------------


### updateShippingCosts(...)

```typescript
updateShippingCosts(options: ApplePayShippingCostsUpdate) => Promise<void>
```

Updates shipping costs and payment summary during Apple Pay checkout.
Call this method in response to the 'applePayShippingContactSelected' event
to dynamically update the Apple Pay sheet with new shipping costs based on
the user's selected shipping address.

| Param         | Type                                                                                | Description                                                 |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#applepayshippingcostsupdate">ApplePayShippingCostsUpdate</a></code> | Updated payment summary items and optional shipping methods |

**Since:** 7.2.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### addListener('applePayShippingContactSelected', ...)

```typescript
addListener(eventName: 'applePayShippingContactSelected', listenerFunc: (contact: ApplePayContact) => void) => Promise<PluginListenerHandle>
```

Add a listener for Apple Pay shipping contact selection events.
This event fires when the user selects or changes their shipping address
during the Apple Pay flow. Use this to recalculate shipping costs and
call updateShippingCosts() with the new amounts.

| Param              | Type                                                                              | Description                                                   |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **`eventName`**    | <code>'applePayShippingContactSelected'</code>                                    | The event name 'applePayShippingContactSelected'              |
| **`listenerFunc`** | <code>(contact: <a href="#applepaycontact">ApplePayContact</a>) =&gt; void</code> | Callback function that receives the selected shipping contact |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.2.0

--------------------


### addListener('applePayShippingMethodSelected', ...)

```typescript
addListener(eventName: 'applePayShippingMethodSelected', listenerFunc: (shippingMethod: ApplePayShippingMethod) => void) => Promise<PluginListenerHandle>
```

Add a listener for Apple Pay shipping method selection events.
This event fires when the user selects or changes their shipping method
during the Apple Pay flow. Use this to recalculate the total cost based
on the selected shipping method and call updateShippingCosts() with the new amounts.

| Param              | Type                                                                                                   | Description                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **`eventName`**    | <code>'applePayShippingMethodSelected'</code>                                                          | The event name 'applePayShippingMethodSelected'              |
| **`listenerFunc`** | <code>(shippingMethod: <a href="#applepayshippingmethod">ApplePayShippingMethod</a>) =&gt; void</code> | Callback function that receives the selected shipping method |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 7.2.0

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all native listeners for this plugin

--------------------


### Interfaces


#### PayAvailabilityResult

| Prop            | Type                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| **`available`** | <code>boolean</code>                                                                |
| **`platform`**  | <code><a href="#payplatform">PayPlatform</a></code>                                 |
| **`apple`**     | <code><a href="#applepayavailabilityresult">ApplePayAvailabilityResult</a></code>   |
| **`google`**    | <code><a href="#googlepayavailabilityresult">GooglePayAvailabilityResult</a></code> |


#### ApplePayAvailabilityResult

| Prop                               | Type                 | Description                                                                          |
| ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------ |
| **`canMakePayments`**              | <code>boolean</code> | Indicates whether the device can make Apple Pay payments in general.                 |
| **`canMakePaymentsUsingNetworks`** | <code>boolean</code> | Indicates whether the device can make Apple Pay payments with the supplied networks. |


#### GooglePayAvailabilityResult

| Prop          | Type                 | Description                                                                    |
| ------------- | -------------------- | ------------------------------------------------------------------------------ |
| **`isReady`** | <code>boolean</code> | Indicates whether the Google Pay API is available for the supplied parameters. |


#### PayAvailabilityOptions

| Prop         | Type                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| **`apple`**  | <code><a href="#applepayavailabilityoptions">ApplePayAvailabilityOptions</a></code>   |
| **`google`** | <code><a href="#googlepayavailabilityoptions">GooglePayAvailabilityOptions</a></code> |


#### ApplePayAvailabilityOptions

| Prop                    | Type                           | Description                                                                                                                          |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`supportedNetworks`** | <code>ApplePayNetwork[]</code> | Optional list of payment networks you intend to use. Passing networks determines the return value of `canMakePaymentsUsingNetworks`. |


#### GooglePayAvailabilityOptions

| Prop                      | Type                                                                  | Description                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **`environment`**         | <code><a href="#googlepayenvironment">GooglePayEnvironment</a></code> | Environment used to construct the Google Payments client. Defaults to `'test'`.                                                              |
| **`isReadyToPayRequest`** | <code><a href="#record">Record</a>&lt;string, unknown&gt;</code>      | Raw `IsReadyToPayRequest` JSON as defined by the Google Pay API. Supply the card networks and auth methods you intend to support at runtime. |


#### PayPaymentResult

| Prop           | Type                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **`platform`** | <code><a href="#exclude">Exclude</a>&lt;<a href="#payplatform">PayPlatform</a>, 'web'&gt;</code> |
| **`apple`**    | <code><a href="#applepaypaymentresult">ApplePayPaymentResult</a></code>                          |
| **`google`**   | <code><a href="#googlepaypaymentresult">GooglePayPaymentResult</a></code>                        |


#### ApplePayPaymentResult

| Prop                        | Type                                                                                                                                                | Description                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **`paymentData`**           | <code>string</code>                                                                                                                                 | Raw payment token encoded as base64 string.          |
| **`paymentString`**         | <code>string</code>                                                                                                                                 | Raw payment token JSON string, useful for debugging. |
| **`transactionIdentifier`** | <code>string</code>                                                                                                                                 | Payment transaction identifier.                      |
| **`paymentMethod`**         | <code>{ displayName?: string; network?: <a href="#applepaynetwork">ApplePayNetwork</a>; type: 'credit' \| 'debit' \| 'prepaid' \| 'store'; }</code> |                                                      |
| **`shippingContact`**       | <code><a href="#applepaycontact">ApplePayContact</a></code>                                                                                         |                                                      |
| **`billingContact`**        | <code><a href="#applepaycontact">ApplePayContact</a></code>                                                                                         |                                                      |


#### ApplePayContact

| Prop                | Type                                                                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`**          | <code>{ givenName?: string; familyName?: string; middleName?: string; namePrefix?: string; nameSuffix?: string; nickname?: string; }</code>                                            |
| **`emailAddress`**  | <code>string</code>                                                                                                                                                                    |
| **`phoneNumber`**   | <code>string</code>                                                                                                                                                                    |
| **`postalAddress`** | <code>{ street?: string; city?: string; state?: string; postalCode?: string; country?: string; isoCountryCode?: string; subAdministrativeArea?: string; subLocality?: string; }</code> |


#### GooglePayPaymentResult

| Prop              | Type                                                             | Description                          |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------ |
| **`paymentData`** | <code><a href="#record">Record</a>&lt;string, unknown&gt;</code> | Payment data returned by Google Pay. |


#### PayPaymentOptions

| Prop         | Type                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| **`apple`**  | <code><a href="#applepaypaymentoptions">ApplePayPaymentOptions</a></code>   |
| **`google`** | <code><a href="#googlepaypaymentoptions">GooglePayPaymentOptions</a></code> |


#### ApplePayPaymentOptions

| Prop                                | Type                                                                  | Description                                                        |
| ----------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **`merchantIdentifier`**            | <code>string</code>                                                   | Merchant identifier created in the Apple Developer portal.         |
| **`countryCode`**                   | <code>string</code>                                                   | Two-letter ISO 3166 country code.                                  |
| **`currencyCode`**                  | <code>string</code>                                                   | Three-letter ISO 4217 currency code.                               |
| **`paymentSummaryItems`**           | <code>ApplePaySummaryItem[]</code>                                    | Payment summary items displayed in the Apple Pay sheet.            |
| **`supportedNetworks`**             | <code>ApplePayNetwork[]</code>                                        | Card networks to support.                                          |
| **`merchantCapabilities`**          | <code>ApplePayMerchantCapability[]</code>                             | Merchant payment capabilities. Defaults to ['3DS'] when omitted.   |
| **`requiredShippingContactFields`** | <code>ApplePayContactField[]</code>                                   | Contact fields that must be supplied for shipping.                 |
| **`requiredBillingContactFields`**  | <code>ApplePayContactField[]</code>                                   | Contact fields that must be supplied for billing.                  |
| **`shippingType`**                  | <code><a href="#applepayshippingtype">ApplePayShippingType</a></code> | Controls the shipping flow presented to the user.                  |
| **`supportedCountries`**            | <code>string[]</code>                                                 | Optional ISO 3166 country codes where the merchant is supported.   |
| **`applicationData`**               | <code>string</code>                                                   | Optional opaque application data passed back in the payment token. |


#### ApplePaySummaryItem

| Prop         | Type                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| **`label`**  | <code>string</code>                                                         |
| **`amount`** | <code>string</code>                                                         |
| **`type`**   | <code><a href="#applepaysummaryitemtype">ApplePaySummaryItemType</a></code> |


#### GooglePayPaymentOptions

| Prop                     | Type                                                                  | Description                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **`environment`**        | <code><a href="#googlepayenvironment">GooglePayEnvironment</a></code> | Environment used to construct the Google Payments client. Defaults to `'test'`.                                                          |
| **`paymentDataRequest`** | <code><a href="#record">Record</a>&lt;string, unknown&gt;</code>      | Raw `PaymentDataRequest` JSON as defined by the Google Pay API. Provide transaction details, merchant info, and tokenization parameters. |


#### ApplePayShippingCostsUpdate

| Prop                      | Type                                  | Description                                                                                                      |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **`paymentSummaryItems`** | <code>ApplePaySummaryItem[]</code>    | Updated payment summary items to display in the Apple Pay sheet. Must include line items and a final total item. |
| **`shippingMethods`**     | <code>ApplePayShippingMethod[]</code> | Optional array of shipping methods to display for the selected address.                                          |


#### ApplePayShippingMethod

| Prop             | Type                                                                              | Description                                                                        |
| ---------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`identifier`** | <code>string</code>                                                               | Unique identifier for the shipping method.                                         |
| **`label`**      | <code>string</code>                                                               | Display label shown in the Apple Pay sheet.                                        |
| **`amount`**     | <code>string</code>                                                               | Cost of the shipping method as a string (e.g., "5.99").                            |
| **`detail`**     | <code>string</code>                                                               | Optional detail text describing the shipping method (e.g., "Arrives in 2-3 days"). |
| **`type`**       | <code><a href="#applepayshippingmethodtype">ApplePayShippingMethodType</a></code> | Type of shipping method.                                                           |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### PayPlatform

<code>'ios' | 'android' | 'web'</code>


#### ApplePayNetwork

<code>'amex' | 'chinaUnionPay' | 'discover' | 'eftpos' | 'electron' | 'girocard' | 'interac' | 'jcb' | 'mada' | 'maestro' | 'masterCard' | 'privateLabel' | 'quicPay' | 'suica' | 'visa' | 'vPay' | 'id' | 'cartesBancaires'</code>


#### GooglePayEnvironment

<code>'test' | 'production'</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


#### Exclude

<a href="#exclude">Exclude</a> from T those types that are assignable to U

<code>T extends U ? never : T</code>


#### ApplePaySummaryItemType

<code>'final' | 'pending'</code>


#### ApplePayMerchantCapability

<code>'3DS' | 'credit' | 'debit' | 'emv'</code>


#### ApplePayContactField

<code>'emailAddress' | 'name' | 'phoneNumber' | 'postalAddress'</code>


#### ApplePayShippingType

<code>'shipping' | 'delivery' | 'servicePickup' | 'storePickup'</code>


#### ApplePayShippingMethodType

<code>'shipping' | 'delivery' | 'servicePickup' | 'storePickup' | 'pickup'</code>

</docgen-api>

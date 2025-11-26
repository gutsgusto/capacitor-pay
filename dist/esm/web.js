import { WebPlugin } from '@capacitor/core';
export class PayWeb extends WebPlugin {
    async isPayAvailable(_options) {
        return {
            available: false,
            platform: 'web',
            apple: {
                canMakePayments: false,
                canMakePaymentsUsingNetworks: false,
            },
            google: {
                isReady: false,
            },
        };
    }
    async requestPayment(_options) {
        throw this.unimplemented('Native payments are not implemented on the web. Use a native platform.');
    }
    async updateShippingCosts(_options) {
        throw this.unimplemented('updateShippingCosts is only available on iOS. Use a native iOS platform.');
    }
    async getPluginVersion() {
        return { version: 'web' };
    }
}
//# sourceMappingURL=web.js.map
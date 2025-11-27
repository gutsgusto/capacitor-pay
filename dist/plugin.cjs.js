'use strict';

var core = require('@capacitor/core');

const Pay = core.registerPlugin('Pay', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.PayWeb()),
});

class PayWeb extends core.WebPlugin {
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
    async completeMerchantValidation(_options) {
        throw this.unimplemented('completeMerchantValidation is only available on iOS. Use a native iOS platform.');
    }
    async getPluginVersion() {
        return { version: 'web' };
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PayWeb: PayWeb
});

exports.Pay = Pay;
//# sourceMappingURL=plugin.cjs.js.map

import { registerPlugin } from '@capacitor/core';
const Pay = registerPlugin('Pay', {
    web: () => import('./web').then((m) => new m.PayWeb()),
});
export * from './definitions';
export { Pay };
//# sourceMappingURL=index.js.map
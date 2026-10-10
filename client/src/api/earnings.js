// ---------------------------------------------------------
// Earnings + banking + payouts API (artist only).
// ---------------------------------------------------------
import { api } from './client';

export const earningsApi = {
    getBanking:  () => api.get('/api/earnings/banking').then(r => r.data),
    saveBanking: (payload) => api.put('/api/earnings/banking', payload).then(r => r.data),
    claim:       (agreedToTerms) =>
        api.post('/api/earnings/claim', { agreedToTerms }).then(r => r.data),
    payouts:     () => api.get('/api/earnings/payouts').then(r => r.data),
};
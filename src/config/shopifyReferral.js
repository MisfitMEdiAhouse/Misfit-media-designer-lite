export const SHOPIFY_REFERRAL_URL = import.meta.env.VITE_SHOPIFY_AFFILIATE_URL
  || 'https://www.shopify.com/free-trial?utm_source=misfitmediahouse&utm_medium=referral&utm_campaign=shopify_scanner';

export const SHOPIFY_AFFILIATE_ACTIVE = Boolean(import.meta.env.VITE_SHOPIFY_AFFILIATE_URL);

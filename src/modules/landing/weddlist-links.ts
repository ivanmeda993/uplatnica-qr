interface WeddlistLinks {
  website: string;
  android: string;
  ios: string | null;
}

// Set ios to the published App Store URL to replace the coming-soon label with a link.
export const WEDDLIST_LINKS: WeddlistLinks = {
  website: 'https://www.weddlist.dev',
  android: 'https://play.google.com/store/apps/details?id=com.hektortech.weddlist',
  ios: null,
};

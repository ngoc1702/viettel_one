import type {Metadata} from 'next'
import {metadata as studioMetadata} from 'next-sanity/studio'

// Set the correct `viewport`, `robots` and `referrer` meta tags
export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Loading Studio...',
};

export default function MyPageComponent() {
  <div></div>
}
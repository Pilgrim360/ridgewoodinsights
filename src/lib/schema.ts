/**
 * Schema markup utilities for SEO structured data (JSON-LD format)
 * Used across marketing pages and blog posts for rich snippets
 */

export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  sameAs?: string[]; // Social media profiles
}

export function generateOrganizationSchema(props: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: props.name,
    url: props.url,
    logo: props.logo,
    description: props.description,
    email: props.email,
    telephone: props.phone,
    ...(props.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: props.address.streetAddress,
        addressLocality: props.address.addressLocality,
        ...(props.address.addressRegion && { addressRegion: props.address.addressRegion }),
        ...(props.address.postalCode && { postalCode: props.address.postalCode }),
        addressCountry: props.address.addressCountry,
      },
    }),
    ...(props.sameAs && props.sameAs.length > 0 && { sameAs: props.sameAs }),
  };

  return schema;
}

export interface LocalBusinessSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[]; // e.g., ["Mo-Fr 09:00-17:00"]
  priceRange?: string; // e.g., "$$"
  sameAs?: string[];
}

export function generateLocalBusinessSchema(props: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: props.name,
    url: props.url,
    logo: props.logo,
    description: props.description,
    email: props.email,
    telephone: props.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address.streetAddress,
      addressLocality: props.address.addressLocality,
      ...(props.address.addressRegion && { addressRegion: props.address.addressRegion }),
      ...(props.address.postalCode && { postalCode: props.address.postalCode }),
      addressCountry: props.address.addressCountry,
    },
    ...(props.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: props.geo.latitude,
        longitude: props.geo.longitude,
      },
    }),
    ...(props.openingHours && props.openingHours.length > 0 && { openingHours: props.openingHours }),
    ...(props.priceRange && { priceRange: props.priceRange }),
    ...(props.sameAs && props.sameAs.length > 0 && { sameAs: props.sameAs }),
  };

  return schema;
}

export interface BlogPostingSchemaProps {
  headline: string;
  description: string;
  image?: string;
  author: string;
  publisher: {
    name: string;
    logo: string;
  };
  datePublished: string;
  dateModified?: string;
  url: string;
  mainEntityOfPage: string;
  articleSection?: string; // Category
  keywords?: string[];
}

export function generateBlogPostingSchema(props: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.headline,
    description: props.description,
    ...(props.image && { image: props.image }),
    author: {
      '@type': 'Person',
      name: props.author,
    },
    publisher: {
      '@type': 'Organization',
      name: props.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: props.publisher.logo,
      },
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    url: props.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.mainEntityOfPage,
    },
    ...(props.articleSection && { articleSection: props.articleSection }),
    ...(props.keywords && props.keywords.length > 0 && { keywords: props.keywords.join(', ') }),
  };

  return schema;
}

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  image?: string;
  author: string;
  publisher: {
    name: string;
    logo: string;
  };
  datePublished: string;
  dateModified?: string;
  url: string;
}

export function generateArticleSchema(props: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    ...(props.image && { image: props.image }),
    author: {
      '@type': 'Person',
      name: props.author,
    },
    publisher: {
      '@type': 'Organization',
      name: props.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: props.publisher.logo,
      },
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.url,
    },
  };

  return schema;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return schema;
}

/**
 * Helper to render schema as JSON-LD script tag
 * Use in Next.js metadata or as a script component
 */
export function renderSchemaScript(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}

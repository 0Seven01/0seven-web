import type { Product } from "@/types/catalog";

interface ProductJsonLdProps {
  product: Product;
  baseUrl: string;
}

export function ProductJsonLd({ product, baseUrl }: ProductJsonLdProps) {
  const lowestPrice = Math.min(...product.variants.map((v) => v.priceKobo)) / 100;
  const highestPrice = Math.max(...product.variants.map((v) => v.priceKobo)) / 100;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${baseUrl}/shop/${product.categorySlug}/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "0Seven",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NGN",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants.length,
      availability: "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "0Seven",
      },
    },
    ...(product.scriptureRef
      ? { additionalProperty: { "@type": "PropertyValue", name: "Scripture", value: product.scriptureRef } }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

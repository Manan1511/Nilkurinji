export const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  vendor
  tags
  availableForSale
  featuredImage { url altText width height }
  images(first: 8) { nodes { url altText width height } }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      quantityAvailable
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      image { url altText width height }
    }
  }
  collections(first: 8) { nodes { handle } }
  details: metafield(namespace: "nilkurinji", key: "details") { value }
  faqs: metafield(namespace: "nilkurinji", key: "faqs") { value }
  reviews: metafield(namespace: "nilkurinji", key: "approved_reviews") { value }
`;

export const PRODUCT_DETAIL_FIELDS = `
  ${PRODUCT_FIELDS}
  teaProfile: metafield(namespace: "nilkurinji", key: "tea_profile") { value }
  howItsMade: metafield(namespace: "nilkurinji", key: "how_its_made") { value }
  howItsMadeApproved: metafield(namespace: "nilkurinji", key: "how_its_made_approved") { value }
`;

export const PRODUCTS_QUERY = `
  query NilkurinjiProducts($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes { ${PRODUCT_FIELDS} }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query NilkurinjiProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_DETAIL_FIELDS} }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  query NilkurinjiCollection($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText width height }
      products(first: 20, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const SHOP_CATEGORY_BANNER_QUERY = `
  query NilkurinjiShopCategoryBanner($handle: String!) {
    metaobject(handle: { type: "nilkurinji_category", handle: $handle }) {
      fields {
        key
        value
        reference {
          ... on MediaImage { image { url altText width height } }
          ... on Metaobject {
            fields {
              key
              value
              reference { ... on MediaImage { image { url altText width height } } }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_QUERY = `
  query NilkurinjiSearch($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes { ... on Product { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const RECOMMENDATIONS_QUERY = `
  query NilkurinjiRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) { ${PRODUCT_FIELDS} }
  }
`;

export const PAGE_BY_HANDLE_QUERY = `
  query NilkurinjiPage($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      seo { title description }
    }
  }
`;

const ARTICLE_FIELDS = `
  id
  handle
  title
  excerpt
  contentHtml
  publishedAt
  authorV2 { name }
  tags
  image { url altText width height }
  seo { title description }
  contentReviewed: metafield(namespace: "nilkurinji", key: "content_reviewed") { value }
  blog { handle title }
`;

export const BLOG_BY_HANDLE_QUERY = `
  query NilkurinjiBlog($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      id
      handle
      title
      articles(first: $first, reverse: true, sortKey: PUBLISHED_AT) {
        nodes { ${ARTICLE_FIELDS} }
      }
    }
  }
`;

export const ARTICLE_BY_HANDLE_QUERY = `
  query NilkurinjiArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) { ${ARTICLE_FIELDS} }
    }
  }
`;

export const BLOG_LANDING_QUERY = `
  query NilkurinjiBlogLanding($handle: String!) {
    metaobject(handle: { type: "nilkurinji_blog_landing", handle: $handle }) {
      fields {
        key
        value
        reference {
          ... on MediaImage { image { url altText width height } }
          ... on Metaobject {
            fields {
              key
              value
              reference { ... on MediaImage { image { url altText width height } } }
            }
          }
        }
      }
    }
  }
`;

export const POLICIES_QUERY = `
  query NilkurinjiPolicies {
    shop {
      privacyPolicy { id title handle body url }
      refundPolicy { id title handle body url }
      shippingPolicy { id title handle body url }
      termsOfService { id title handle body url }
    }
  }
`;

export const HOME_METAOBJECT_QUERY = `
  query NilkurinjiHomepage {
    metaobject(handle: { type: "nilkurinji_home", handle: "home" }) {
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage { image { url altText width height } }
        }
      }
    }
  }
`;

export const SHIPPING_METAOBJECT_QUERY = `
  query NilkurinjiIndiaShipping {
    metaobject(handle: { type: "nilkurinji_shipping", handle: "india" }) {
      fields {
        key
        value
        reference {
          ... on GenericFile { url mimeType originalFileSize }
        }
      }
    }
  }
`;

export const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id
          title
          availableForSale
          price { amount currencyCode }
          image { url altText width height }
          product {
            id
            title
            handle
            featuredImage { url altText width height }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  query NilkurinjiCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation NilkurinjiCartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation NilkurinjiCartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation NilkurinjiCartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation NilkurinjiCartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

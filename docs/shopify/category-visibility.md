# Category visibility in Shopify

The storefront reads the `enabled` boolean of each `nilkurinji_category` metaobject. All five categories are visible by default. These settings control category links and homepage tiles. They do not change product publication or remove products from Shop All or search.

## One-time Shopify setup

1. In Shopify admin, open **Settings → Metafields and metaobjects** and find the category metaobject definition. If it does not exist, create a definition with type `nilkurinji_category`.
2. Add a **True or false** field named **Enabled**, with key `enabled`. Enable Storefront access for the definition. Preserve any existing category fields.
3. In **Content → Metaobjects**, create or edit an active entry for each category. Set its handle and Enabled value as follows:

   | Handle | Initial value |
   | --- | --- |
   | `tea` | true |
   | `tea-bags` | true |
   | `rice` | true |
   | `snacks` | true |
   | `other-foods` | true |

4. To show or hide a category later, edit its entry and change **Enabled**. The storefront refreshes cached content after approximately 60 seconds.

An absent entry or absent Enabled field uses the defaults above. If Shopify cannot be reached, the defaults are used until it becomes available. Category images use the Shopify collection image when present and the existing local category artwork otherwise.

This definition and its entries still need to be created in Shopify admin. The local project does not have Shopify Admin API credentials.

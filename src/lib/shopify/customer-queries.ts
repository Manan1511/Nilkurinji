export const ACCOUNT_OVERVIEW_QUERY = `
  query NilkurinjiAccountOverview {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 5, reverse: true, sortKey: CREATED_AT) {
        nodes { id name createdAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } }
      }
    }
  }
`;

export const ACCOUNT_ORDERS_QUERY = `
  query NilkurinjiAccountOrders {
    customer {
      orders(first: 50, reverse: true, sortKey: CREATED_AT) {
        nodes { id name createdAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } }
      }
    }
  }
`;

export const ACCOUNT_ORDER_DETAILS_QUERY = `
  query NilkurinjiAccountOrderDetails {
    customer {
      orders(first: 50, reverse: true, sortKey: CREATED_AT) {
        nodes {
          id name createdAt processedAt cancelledAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } statusPageUrl
          lineItems(first: 100) { nodes { id name quantity } }
          shippingAddress { firstName lastName address1 address2 city province country zip }
        }
      }
    }
  }
`;

export const ACCOUNT_ADDRESSES_QUERY = `
  query NilkurinjiAccountAddresses {
    customer {
      id
      defaultAddress { id }
      addresses(first: 50) {
        nodes { id firstName lastName company address1 address2 city country countryCode province zoneCode zip phoneNumber formatted }
      }
    }
  }
`;

export const ADDRESS_IDS_QUERY = `
  query NilkurinjiCustomerAddressIds {
    customer { id addresses(first: 50) { nodes { id } } }
  }
`;

export const CUSTOMER_ADDRESS_CREATE = `
  mutation NilkurinjiCustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE = `
  mutation NilkurinjiCustomerAddressUpdate($address: CustomerAddressInput, $addressId: ID!, $defaultAddress: Boolean) {
    customerAddressUpdate(address: $address, addressId: $addressId, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { field message }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE = `
  mutation NilkurinjiCustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) { deletedAddressId userErrors { field message } }
  }
`;

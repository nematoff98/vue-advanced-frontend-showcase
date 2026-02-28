import { AddressForm, AddressFormExternal, FavouriteAddressFormExternal } from '@/services/lead-address/lead-address.interface';

export const addressUpdateFormExternalMapper = (model: AddressForm): AddressFormExternal => ({
  type: model.type,
  state: model.state,
  city: model.city,
  zip: model.zip,
  country: model.country,
  date: model.date,
  is_residential: model.isResidential,
  address: model.address,
  business_name: model.businessName,
  contact_name: model.contactName,
  phone: model.phone,
  comment: model.comment,
  buyer_number: model.buyerNumber,
  port_id: model.portId,
  additional_phones: model.additionalPhones,
});

export const addressAddFavouriteFormExternalMapper = (model: AddressForm, name: string): FavouriteAddressFormExternal => ({
  name,
  type: model.type,
  city: model.city,
  state: model.state,
  zip: model.zip,
  country: model.country,
  is_residential: model.isResidential,
  business_name: model.businessName,
  address: model.address,
  buyer_number: model.buyerNumber,
  contact_name: model.contactName,
  phone: model.phone,
  additional_phones: model.additionalPhones,
  comment: model.comment,
});

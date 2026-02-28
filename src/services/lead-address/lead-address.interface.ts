import { LeadAddressType } from '@/services/lead-address/lead-address.list';
import { PortType } from '@/services/ports';

export interface LeadAddressPort {
  id: number
  name: string
  state: string
  city: string
  zip: string
  country: string
  type: PortType
  address: string
  hours: string
  storage_policy: string
  notes: string
  status: string
}

export interface Address {
  id: number
  city: string
  state: string
  zip: string
  country: string
  isResidential: boolean
  address: string
  buyerNumber: string
  date: string
  contactName: string
  phone: string
  additionalPhones: string[]
  comment: string
  createdAt: string
  port?: LeadAddressPort
}

export interface LeadAddress {
  origin?: Address,
  destination?: Address
}

export interface AddressForm {
  addressSearch?: string
  type?: LeadAddressType
  state?: string
  city?: string
  zip?: string
  country?: string
  date?: string
  businessName?: string
  isResidential?: boolean
  address?: string
  contactName?: string
  phone?: string
  comment?: string
  buyerNumber?: string
  portId?: number
  additionalPhones?: string[]
  helperAdditionalPhones: Array<{value: string}>
}

export interface AddressFormExternal {
  type?: LeadAddressType
  state?: string
  city?: string
  zip?: string
  country?: string
  date?: string
  business_name?: string
  is_residential?: boolean
  address?: string
  contact_name?: string
  phone?: string
  port_id?: number
  comment?: string
  buyer_number?: string
  additional_phones?: string[]
}

export interface FavouritesAddresses {
  id: number
  name: string
  type: string
  city: string
  state: string
  zip: string
  country: string
  isResidential: boolean
  businessName: string
  address: string
  buyerNumber: string
  contactName: string
  phone: string
  additionalPhones: string[]
  comment: string
  timezone: string
  createdAt: string
  updatedAt: string
  loading?: boolean
  port?: LeadAddressPort
}

export interface FavouriteAddressFormExternal {
  name?: string
  type?: LeadAddressType
  city?: string
  state?: string
  zip?: string
  country?: string
  is_residential?: boolean,
  business_name?: string
  address?: string
  buyer_number?: string
  contact_name?: string
  phone?: string
  additional_phones?: string[],
  comment?: string
  timezone?: string
}

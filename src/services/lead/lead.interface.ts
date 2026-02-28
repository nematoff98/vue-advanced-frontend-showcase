import { CustomerIdType, LeadStatus } from '@/services/lead';
import { LeadVehicle, TrailerType } from '@/services/lead-vehicle';
import { Provider } from '@/services/lead-provider';
import { LeadAddress } from '@/services/lead-address';
import { PageableRequestParams } from '@/services/general';

export interface Lead {
  id: number;
  chatId: number;
  fullName: string;
  phone: string;
  price: number;
  priceOpen: number;
  priceEnclosed: number;
  carrierFee: number;
  deposit: number;
  trailerType: TrailerType;
  createdAt: string;
  pickupDate: string;
  status: LeadStatus;
  vehicles: LeadVehicle[];
  originLocation: string;
  leadNumber: number;
  destinationLocation: string;
}

export interface FullLeadInfo extends Omit<Lead, 'vehicles'> {
  brokerName: string
  leadProviderId: number
  leadProvider: Provider
  firstName: string
  lastName: string
  leadId: number
  email: string
  distance: number
  pricePerMile: number
  userAgree: boolean | null
  comment: string
  isBlocked: boolean
  carrierFee: number
  bookingLink: string
  oceanFee: string
  contractLink: string
  dropOffDate: string
  customerIdNumber?: string
  customerIdType?: CustomerIdType
  bookingNumber?: string
  userId?: number
}

export interface LeadVehicleForm {
  vehicleId?: number,
  vehicleRun?: boolean,
  vehicleYear?: number,
  vehicleMakeId?: number,
  vin?: string
}

export interface LeadVehicleFormExternal {
  vehicle_id?: number,
  vehicle_run?: boolean,
  vin?: string
}

export interface LeadRequestForm {
  originAddressSearch?: string
  destinationAddressSearch?: string
  originCity?: string,
  originState?: string,
  originZip?: string,
  destinationCity?: string,
  destinationState?: string,
  destinationZip?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  transportType?: TrailerType,
  shipDate?: string,
  leadProviderId?: number,
  comment?: string,
  originPortId?: number
  destinationPortId?: number
  bookingNumber?: string
  customerIdNumber?: string
  customerIdType?: CustomerIdType
  vehicles?: LeadVehicleForm[],
}

export interface LeadRequestFormExternal {
  origin_city?: string,
  origin_state?: string,
  origin_zip?: string,
  destination_city?: string,
  destination_state?: string,
  destination_zip?: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  origin_port_id?: number
  destination_port_id?: number
  phone?: string,
  transport_type?: string,
  ship_date?: string,
  lead_provider_id?: number,
  comment?: string,
  booking_number?: string
  customer_id_number?: string
  customerId_type?: CustomerIdType
  vehicles?: LeadVehicleFormExternal[],
}

export interface LeadsTableFilter extends PageableRequestParams {
  status?: LeadStatus,
  search?: string,
  originZip?: string,
  leadProviderId?: number,
  destinationZip?: string,
  fromDate?: string,
  toDate?: string,
  userAgree?: boolean,
  userId?: number,
}

export interface LeadsTableFilterExternal extends PageableRequestParams {
  status?: LeadStatus,
  search?: string,
  origin_zip?: string,
  lead_provider_id?: number,
  destination_zip?: string,
  from_date?: string,
  to_date?: string,
  user_agree?: boolean,
  user_id?: number,
}

export interface UpdateLeadActionsForm {
  status?: LeadStatus
  userAgree?: boolean
  trailerType?: TrailerType
}

export interface UpdateLeadActionsFormExternal {
  status?: LeadStatus
  user_agree?: boolean
  trailer_type?: TrailerType
}

export interface ExtendedLeadInfo extends FullLeadInfo {
  vehicles: LeadVehicle[],
  address: LeadAddress
}

export interface LeadContactEditForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  bookingNumber?: string
  customerIdNumber?: string
  customerIdType?: CustomerIdType
}

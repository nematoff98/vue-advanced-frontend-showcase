import {
  LeadRequestForm,
  LeadRequestFormExternal,
  LeadsTableFilter,
  LeadsTableFilterExternal,
  LeadVehicleForm,
  LeadVehicleFormExternal,
  UpdateLeadActionsForm,
  UpdateLeadActionsFormExternal,
} from '@/services/lead/lead.interface';

export const updateLeadActionsFormExternalMapper = (model: UpdateLeadActionsForm): UpdateLeadActionsFormExternal => ({
  status: model.status,
  trailer_type: model.trailerType,
  user_agree: model.userAgree,
});

export const leadVehicleFormExternalMapper = (model: LeadVehicleForm): LeadVehicleFormExternal => ({
  vehicle_id: model.vehicleId,
  vin: model.vin,
  vehicle_run: model.vehicleRun || false,
});

export const leadFormExternalMapper = (model: LeadRequestForm): LeadRequestFormExternal => ({
  origin_city: model.originCity,
  origin_state: model.originState,
  origin_zip: model.originZip,
  destination_city: model.destinationCity,
  destination_state: model.destinationState,
  destination_zip: model.destinationZip,
  first_name: model.firstName,
  last_name: model.lastName,
  email: model.email,
  phone: model.phone,
  transport_type: model.transportType,
  ship_date: model.shipDate,
  lead_provider_id: model.leadProviderId,
  comment: model.comment,
  booking_number: model.bookingNumber,
  customer_id_number: model.customerIdNumber,
  origin_port_id: model.originPortId,
  destination_port_id: model.destinationPortId,
  customerId_type: model.customerIdType,
  vehicles: model.vehicles?.map(leadVehicleFormExternalMapper),
});

export const leadFilterExternalMapper = (filter?: LeadsTableFilter) => {
  if (!filter) return {};

  const preparedFilter: LeadsTableFilterExternal = {
    page: filter.page,
    perPage: filter.perPage,
  };

  if (filter.status) {
    preparedFilter.status = filter.status;
  }

  if (filter.search) {
    preparedFilter.search = filter.search;
  }

  if (filter.originZip) {
    preparedFilter.origin_zip = filter.originZip;
  }

  if (filter.leadProviderId) {
    preparedFilter.lead_provider_id = filter.leadProviderId;
  }

  if (filter.destinationZip) {
    preparedFilter.destination_zip = filter.destinationZip;
  }

  if (filter.fromDate) {
    preparedFilter.from_date = filter.fromDate;
  }

  if (filter.toDate) {
    preparedFilter.to_date = filter.toDate;
  }

  if (filter.userAgree) {
    preparedFilter.user_agree = filter.userAgree;
  }

  if (filter.userId) {
    preparedFilter.user_id = filter.userId;
  }

  return preparedFilter;
};

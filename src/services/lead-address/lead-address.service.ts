import { ApiServiceInstance } from '@/services/api.service';
import { addressAddFavouriteFormExternalMapper, addressUpdateFormExternalMapper } from '@/services/lead-address/lead-address.mapper';
import { PageableApiResponse } from '@/services/general';
import { AddressForm, FavouritesAddresses, LeadAddress } from './lead-address.interface';

class LeadAddressService {
  private httpClient = ApiServiceInstance;

  public async getLeadAddresses(leadId: number): Promise<LeadAddress> {
    return await this.httpClient.get(`/auto-logistics/leads/addresses/${leadId}`);
  }

  public async updateLeadAddresses(leadId: number, form: AddressForm) {
    return await this.httpClient.put(`/auto-logistics/leads/addresses/${leadId}`, addressUpdateFormExternalMapper(form));
  }

  public async getFavouritesAddresses(name?: string): Promise<PageableApiResponse<FavouritesAddresses>> {
    return await this.httpClient.get(`/leads/favourite-addresses/search?name=${name}`);
  }

  public async addAddressToFavourites(form: AddressForm, name: string) {
    return await this.httpClient.post('/leads/favourite-addresses', addressAddFavouriteFormExternalMapper(form, name));
  }

  public async removeAddressFromFavourites(addressId: number) {
    return await this.httpClient.delete(`leads/favourite-addresses/${addressId}`);
  }
}

export const LeadAddressServiceInstance = new LeadAddressService();

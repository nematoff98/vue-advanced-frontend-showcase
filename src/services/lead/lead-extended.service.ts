import { LeadServiceInstance } from '@/services/lead/lead.service';
import { LeadAddressServiceInstance } from '@/services/lead-address';
import { LeadVehicleServiceInstance } from '@/services/lead-vehicle';
import { ExtendedLeadInfo } from '@/services/lead/lead.interface';

class LeadExtendedService {
  private leadServiceInstanceInstance = LeadServiceInstance;

  private leadAddressServiceInstance = LeadAddressServiceInstance;

  private leadVehicleServiceInstance = LeadVehicleServiceInstance;

  public async getFullLeadInfo(leadId: number): Promise<ExtendedLeadInfo> {
    const [leadInfo, address, vehicles] = await Promise.all([
      this.leadServiceInstanceInstance.getLead(leadId),
      this.leadAddressServiceInstance.getLeadAddresses(leadId),
      this.leadVehicleServiceInstance.getLeadVehicleList(leadId),
    ]);

    return {
      ...leadInfo,
      address,
      vehicles,
    };
  }
}

export const LeadExtendedServiceInstance = new LeadExtendedService();

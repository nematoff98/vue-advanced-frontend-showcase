import { ApiServiceInstance } from '@/services/api.service';
import { leadFilterExternalMapper, leadFormExternalMapper, updateLeadActionsFormExternalMapper } from '@/services/lead/lead.mapper';
import { PageableApiResponse } from '@/services/general';
import {
  FullLeadInfo, Lead, LeadRequestForm, LeadsTableFilter, UpdateLeadActionsForm,
} from './lead.interface';

class LeadService {
  private httpClient = ApiServiceInstance;

  public async updateLead(leadId: number, model: UpdateLeadActionsForm): Promise<void> {
    await this.httpClient.put(
      `/auto-logistics/leads/${leadId}/update-actions`,
      updateLeadActionsFormExternalMapper(model),
    );
  }

  public async getLead(leadId: number): Promise<FullLeadInfo> {
    return await this.httpClient.get(`/auto-logistics/leads/${leadId}`);
  }

  public async getLeads(params?: LeadsTableFilter): Promise<PageableApiResponse<Lead>> {
    return await this.httpClient.get('/auto-logistics/leads', leadFilterExternalMapper(params));
  }

  public async createLead(model: LeadRequestForm): Promise<void> {
    await this.httpClient.post(
      '/auto-logistics/leads',
      leadFormExternalMapper(model),
    );
  }

  public async updateLeadData(leadId: number, model: LeadRequestForm): Promise<void> {
    await this.httpClient.put(
      `/auto-logistics/leads/${leadId}`,
      leadFormExternalMapper(model),
    );
  }

  public async askAiCall(leadId: number) {
    return await this.httpClient.post(`/calls/ai/${leadId}/initiate`);
  }

  public async leadReassign(leadId: number, userId: number) {
    return await this.httpClient.post(`/auto-logistics/leads/${leadId}/reassign`, {
      user_id: userId,
    });
  }
}

export const LeadServiceInstance = new LeadService();

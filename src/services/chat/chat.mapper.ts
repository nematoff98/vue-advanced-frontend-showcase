import { FetchChatsParams, FetchChatsParamsExternal } from '@/services/chat/chat.interface';

export const chatListExternalParams = (model: FetchChatsParams): FetchChatsParamsExternal => ({
  search: model.search,
  responsible: model.responsible,
  lead_status: model.leadStatus,
  not_answered: model.notAnswered,
  unread: model.unread,
  unspecified_price: model.unspecifiedPrice,
  user_agree: model.userAgree,
  page: model.page,
  per_page: model.perPage,
});

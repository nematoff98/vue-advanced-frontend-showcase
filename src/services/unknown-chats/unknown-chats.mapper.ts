import { CreateUnknownChatForm, CreateUnknownChatPayloadExternal } from '@/services/unknown-chats/unknown-chats.interface';

export const createUnknownChatExternalMapper = (
  model: CreateUnknownChatForm,
): CreateUnknownChatPayloadExternal => ({
  profile_name: model.profileName,
  phone: model.phone,
  email: model.email,
});

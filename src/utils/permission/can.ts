import { PermissionEnum, STORAGE_KEYS } from './enums';

type Permission = PermissionEnum | string;
type CanFunction = (permissions: Permission[] | Permission) => boolean;

export const useCan = (): CanFunction => (requested: Permission[] | Permission): boolean => {
  const storedPermissions = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
  if (!storedPermissions) return false;

  const userPermissions: string[] = JSON.parse(storedPermissions);
  const requestedArray = Array.isArray(requested) ? requested : [requested];

  return requestedArray.some((perm) => userPermissions.includes(perm));
};

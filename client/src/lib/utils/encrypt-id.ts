export const encryptId = (id: string) => btoa(id);
export const decryptId = (id: string) => atob(id);

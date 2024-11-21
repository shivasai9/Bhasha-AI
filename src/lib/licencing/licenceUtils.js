import { USABLE_LICENCES } from "./licences";

export const isUsableLicense = (license) => {
  if (!license) return false;
  const normalizedLicense = license.toLowerCase().split(" ").join("-");
  return USABLE_LICENCES.includes(normalizedLicense);
};

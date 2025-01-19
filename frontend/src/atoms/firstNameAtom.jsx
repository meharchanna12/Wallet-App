import { atom } from "recoil";

export const firstNameState = atom({
  key: "firstNameState", // Unique ID for this atom
  default: "", // Default value
});

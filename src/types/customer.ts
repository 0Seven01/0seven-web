export type FulfilmentMethod = "pickup" | "delivery";

export interface CustomerDetails {
  fullName: string;
  phone: string;
  deliveryMethod: FulfilmentMethod;
  deliveryAddress?: string;
}

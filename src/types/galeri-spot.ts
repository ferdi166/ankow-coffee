import type { ReactNode } from "react";

export interface Facility {
  icon: string;
  label: string;
}

export interface SpotItem {
  id: string;
  title: string;
  description: string;
  category: "Indoor" | "Outdoor";
  categoryIcon: string;
  capacity: string;
  imageUrl: string;
  isVisible: boolean;
  facilities: Facility[];
}

export type FacilityIconResolver = (iconName: string) => ReactNode;


export type ShopStatus = 'connected' | 'disconnected';

export interface Shop {
  id: string;
  name: string;
  status: ShopStatus;
  serviceEnabled: boolean;
}

export enum ModalMode {
  OVERVIEW = 'OVERVIEW',
  SCANNING = 'SCANNING',
  RESULT = 'RESULT'
}

export enum TabType {
  SERVICE_DISABLED = 'SERVICE_DISABLED',
  PANEL_DISCONNECTED = 'PANEL_DISCONNECTED'
}

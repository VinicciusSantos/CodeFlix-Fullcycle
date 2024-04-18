export interface IStorage {
  store(object: StoreProps): Promise<void>;
  get(id: string): Promise<GetFromStorage>;
}

export interface StoreProps {
  data: Buffer;
  mime_type?: string;
  id: string;
}

export interface GetFromStorage {
  data: Buffer;
  mime_type: string | undefined;
}

export type iListener <T=any> = (e: iEvent<T>) => void;

export interface iEvent<T> extends Event{
  data: T;
}
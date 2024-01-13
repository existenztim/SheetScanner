export interface INote {
  _id?: string;
  title: string;
  type: {
    [propertyKey: string]: string;
  };
  createDate: string;
  lastUpdated?: string;
  fileName: string;
}

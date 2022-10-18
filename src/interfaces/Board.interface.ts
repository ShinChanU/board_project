import { UserTokenProps } from './User.interface';

export interface BoardUserTypeProps {
  user?: UserTokenProps;
  type: string;
}

export interface BoardDetailDataProps {
  author: string;
  body: string;
  category: string;
  companyCode: string;
  createdAt: string;
  updatedAt?: string;
  orgFileName: string[];
  saveFileName: string[];
  title: string;
  views: 1;
  __v: 0;
  _id: string;
}

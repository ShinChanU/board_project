export interface UserTokenProps {
  companyCode: string;
  realName: string;
  userType: string;
  username: string;
  __v: number;
  _id: string;
}

export interface AuthInputProps {
  placeHolder: string;
  type: string;
  value: string;
}

export interface AuthFormProps {
  [key: string]: AuthInputProps;
}

export interface StringProps {
  [key: string]: string;
}

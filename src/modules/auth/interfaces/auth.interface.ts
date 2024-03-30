export interface IAuthUserResponse {
  id: string;
  email: string;
  fullName: string;
}

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  user: IAuthUserResponse;
}

export interface IAuthRefreshResponse {
  access_token: string;
}

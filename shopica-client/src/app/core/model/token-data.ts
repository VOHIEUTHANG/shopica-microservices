export interface TokenData {
  userId: number;
  username: string;
  sub: string;
  roleName: string;
  exp: number;
  isSocial: boolean;
  token: Token;
  imageUrl: string;
}

export interface Token {
  token: string;
  expiresIn: number;
}
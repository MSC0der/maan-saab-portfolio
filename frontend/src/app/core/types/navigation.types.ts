export interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly exact: boolean;
}

export interface SocialLink {
  readonly label: string;
  readonly url: string;
}

export const userMainRoute = 'user';

export class UserRoutes {
  static get mainRoute(): string {
    return userMainRoute;
  }

  static getUser(id: number): string {
    return `${userMainRoute}/${id}`;
  }
}

import User from './User';

export default class Player {
  readonly user: User;
  private isReady: boolean;

  constructor(user: User) {
    this.user = user;
    this.isReady = false;
  }

  setIsReady(isReady: boolean) {
    this.isReady = isReady;
  }

  getIsReady() {
    return this.isReady;
  }
}

/* @Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: BullBoardAuthService) {
    super();
  }

  public validate(
    username: string,
    password: string,
  ): { username: string } {
    const isValid = this.authService.validate(username, password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { username };
  }
} */

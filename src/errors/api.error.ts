export class ApiError extends Error {
  public status: number;
  constructor(massage: string, status: number) {
    super(massage);
    this.status = status;
  }
}

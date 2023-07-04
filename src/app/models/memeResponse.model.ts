class MemeResponse {
  constructor(
    public boxCount: number,
    public captions: number,
    public height: number,
    public id: string,
    public name: string,
    public url: string,
    public width: number
  ) {}
}

export interface ResponseData {
  data: { memes: MemeResponse[]; success: boolean };
}

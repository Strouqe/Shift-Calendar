export class MemeResponse {
  constructor(
    // public author: string,
    // public nsfw: boolean,
    // public postLink: string,
    // public preview: string[],
    // public spoiler: boolean,
    // public subreddit: string,
    // public title: string,
    // public ups: number,
    // public url: string
    public box_count: number,
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

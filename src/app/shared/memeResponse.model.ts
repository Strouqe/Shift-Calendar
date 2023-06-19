export class MemeResponse {
  constructor(
    public author: string,
    public nsfw: boolean,
    public postLink: string,
    public preview: string[],
    public spoiler: boolean,
    public subreddit: string,
    public title: string,
    public ups: number,
    public url: string,
  ){}
}

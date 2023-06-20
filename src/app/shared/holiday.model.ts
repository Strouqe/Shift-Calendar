export class Holiday {
  public canonical_url: string;
  public country: {
    id: string;
    name: string;
  };
  public date: {
    datetime: {
      day: number;
      month: number;
      year: number;
    };
    iso: string;
  };
  public description: string;
  public locations: string;
  public name: string;
  public primary_type: string;
  public states: string;
  public type: string[];
  public uuid: string;
}


export namespace NSKomica {
  export const config = {
    domain: 'http://2cat.komica.org',
    live: 'https://2cat.komica.org/~tedc21thc/live',
    new: 'https://2cat.komica.org/~tedc21thc/new'
  };

  export interface IPostData {
    id: string;
    title: string | null;
    text: string | null;
    oImg: string;
    sImg: string;
    name: string;
    dateTime: string;
    userId: string;
    warnText: string | null;
    reply: IPostData[];
  }
}

import { Request, Response } from 'express';
import { ResultVM } from './result.vm';

export interface RequestExtension extends Request {
  query: {
    p: number,
    resId: string
    [key: string]: string | number | Array<string | number>
  };

  cookies: {
    [key: string]: any
  };
}

export interface ResponseExtension extends Response {
  result?: ResultVM;

}

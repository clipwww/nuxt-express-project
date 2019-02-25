import { RequestExtension, ResponseExtension } from '~/view-models/extension.vm';
import { ResultVM, ResultCode } from '../../view-models/result.vm';

export const responseEndMiddleware = async (_req: RequestExtension, res: ResponseExtension) => {
  try {

    res.json(res.result);

  } catch (error) {
    const result = new ResultVM();

    res.json(result.setResultValue(false, ResultCode.error, error.message));

  } finally {
    res.end();
  }
};

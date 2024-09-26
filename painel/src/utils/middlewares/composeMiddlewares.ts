import { NextRequest } from 'next/server';

export function composeMiddlewares(
  ...middlewares: Array<
    (req: NextRequest) => Response | Promise<Response | undefined> | undefined
  >
) {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result) {
        return result;
      }
    }
    return undefined;
  };
}

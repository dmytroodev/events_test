import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from './error-handler';

function buildValidationErrorMessage(errors: unknown[]): string {
  return JSON.stringify(
    errors,
    (key, value) => {
      if (key === 'target') {
        return undefined;
      }

      if (key === 'children' && Array.isArray(value) && value.length === 0) {
        return undefined;
      }

      return value;
    },
  );
}

export function validateQuery<T extends object>(type: ClassConstructor<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(type, req.query, { enableImplicitConversion: true });
    const errors = await validate(instance, { whitelist: true, forbidUnknownValues: true });

    if (errors.length > 0) {
      const message = buildValidationErrorMessage(errors);
      next(new HttpError(400, message));
      return;
    }

    req.query = instance as unknown as Request['query'];
    next();
  };
}

export function validateBody<T extends object>(type: ClassConstructor<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(type, req.body, { enableImplicitConversion: true });
    const errors = await validate(instance, { whitelist: true, forbidUnknownValues: true });

    if (errors.length > 0) {
      const message = buildValidationErrorMessage(errors);
      next(new HttpError(400, message));
      return;
    }

    req.body = instance as unknown as Request['body'];
    next();
  };
}

export function validateParams<T extends object>(type: ClassConstructor<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(type, req.params, { enableImplicitConversion: true });
    const errors = await validate(instance, { whitelist: true, forbidUnknownValues: true });

    if (errors.length > 0) {
      const message = buildValidationErrorMessage(errors);
      next(new HttpError(400, message));
      return;
    }

    req.params = instance as unknown as Request['params'];
    next();
  };
}


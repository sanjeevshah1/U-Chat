import { ZodSchema, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
const validateResource =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedError = error.issues.map((err) => {
          const cleanedPath =
            err.path[0] === "body"
              ? err.path.slice(1).join(".")
              : err.path.join(".");
          return {
            path: cleanedPath,
            message: err.message,
          };
        });
        console.log(formattedError);
        res.status(400).send({
          success: false,
          errors: formattedError,
        });
      } else {
        res.status(400).send("Something went wrong");
      }
    }
  };

export default validateResource;

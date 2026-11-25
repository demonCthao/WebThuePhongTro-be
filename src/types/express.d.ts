import { PaginationQuery } from "../common/pagination.middleware";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationQuery;
      user?: JwtPayload & {
        id: string;
      };
    }
  }
}
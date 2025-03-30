// app/api/auth/siwsol/route.ts
import { createSiwsolHandler } from "@vmkit/connect-svm/server";

const handler = createSiwsolHandler();

export const GET = handler.GET;
export const PUT = handler.PUT;
export const POST = handler.POST;
export const DELETE = handler.DELETE;
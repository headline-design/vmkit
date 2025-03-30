// app/api/auth/siwsol/route.ts
import { createSiwsHandler } from "@vmkit/connect-substrate/server";

const handler = createSiwsHandler();

export const GET = handler.GET;
export const PUT = handler.PUT;
export const POST = handler.POST;
export const DELETE = handler.DELETE;
// app/api/auth/siwsol/route.ts
import { createSiweHandler } from "@vmkit/connect-evm/server";

const handler = createSiweHandler();

export const GET = handler.GET;
export const PUT = handler.PUT;
export const POST = handler.POST;
export const DELETE = handler.DELETE;
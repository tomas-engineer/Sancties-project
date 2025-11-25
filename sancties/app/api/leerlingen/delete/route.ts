import { DeleteLeerling } from "@/database";
import { SendResponse } from "@/services/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const text = await req.text();

  if (!text || text.trim() === "") {
    console.error("Body is empty!");
    return SendResponse(
      {
        success: false,
        message: "Request body is empty",
      },
      400
    );
  }

  let body;

  try {
    body = JSON.parse(text);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return SendResponse(
      {
        success: false,
        message: "Invalid JSON in request body",
      },
      400
    );
  }

  if (!body?.id)
    return SendResponse(
      {
        success: false,
        message: "Leerling ID is required",
      },
      400
    );

  const deleted = DeleteLeerling(body.id);

  if (!deleted)
    return SendResponse(
      {
        success: false,
        message: "Something went wrong",
      },
      500
    );

  return SendResponse({
    success: true,
    message: "Leerling successfully deleted",
  });
}

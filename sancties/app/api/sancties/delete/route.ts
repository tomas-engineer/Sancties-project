import { DeleteSanctie } from "@/database";
import { SendResponse } from "@/services/response";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (!text) {
      return SendResponse(
        {
          success: false,
          message: "Request body is required",
        },
        400
      );
    }

    const body = JSON.parse(text);
    const { id } = body;

    if (!id || typeof id !== "number") {
      return SendResponse(
        {
          success: false,
          message: "ID is required and must be a number",
        },
        400
      );
    }

    const result = DeleteSanctie(id);

    if (!result.success) {
      return SendResponse(
        {
          success: false,
          message: result.message || "Failed to delete sanctie",
        },
        result.message.includes("not found") ? 404 : 500
      );
    }

    return SendResponse({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return SendResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

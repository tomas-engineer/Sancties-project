import { EditSanctie } from "@/database";
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
    const { id, naam, niveau } = body;

    if (!id || typeof id !== "number") {
      return SendResponse(
        {
          success: false,
          message: "ID is required and must be a number",
        },
        400
      );
    }

    if (!naam && niveau === undefined) {
      return SendResponse(
        {
          success: false,
          message: "At least naam or niveau must be provided",
        },
        400
      );
    }

    if (naam !== undefined && (typeof naam !== "string" || naam.trim() === "")) {
      return SendResponse(
        {
          success: false,
          message: "Naam must be a non-empty string",
        },
        400
      );
    }

    if (niveau !== undefined && typeof niveau !== "number") {
      return SendResponse(
        {
          success: false,
          message: "Niveau must be a number",
        },
        400
      );
    }

    const result = EditSanctie(id, naam, niveau);

    if (!result.success) {
      return SendResponse(
        {
          success: false,
          message: result.message || "Failed to edit sanctie",
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

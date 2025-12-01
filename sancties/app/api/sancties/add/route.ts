import { AddSanctie } from "@/database";
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
    const { naam, niveau } = body;

    if (!naam || typeof naam !== "string" || naam.trim() === "") {
      return SendResponse(
        {
          success: false,
          message: "Naam is required and must be a non-empty string",
        },
        400
      );
    }

    if (niveau === undefined || typeof niveau !== "number") {
      return SendResponse(
        {
          success: false,
          message: "Niveau is required and must be a number",
        },
        400
      );
    }

    const result = AddSanctie(naam, niveau);

    if (!result.success) {
      return SendResponse(
        {
          success: false,
          message: result.message || "Failed to add sanctie",
        },
        500
      );
    }

    return SendResponse(
      {
        success: true,
        message: result.message,
        id: result.id,
      },
      201
    );
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

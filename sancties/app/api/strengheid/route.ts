import { GetDocentStrengheid } from "@/database";
import { SendResponse } from "@/services/response";

export function GET() {
  const result = GetDocentStrengheid();

  if (!result.success) {
    return SendResponse(
      {
        success: false,
        message: result.message || "Failed to calculate strengheid",
      },
      500
    );
  }

  return SendResponse({
    success: true,
    strengheid: result.strengheid,
    percentage: result.percentage,
  });
}

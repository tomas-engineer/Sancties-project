import { FetchSancties } from "@/database";
import { SendResponse } from "@/services/response";

export function GET() {
  const sancties = FetchSancties();

  if (!sancties || sancties.length === 0)
    return SendResponse(
      {
        success: false,
        message: "Failed to fetch sancties",
      },
      500
    );

  return SendResponse({ success: true, sancties });
}

import { FetchLeerlingen } from "@/database";
import { SendResponse } from "@/services/response";

export function GET() {
  const leerlingen = FetchLeerlingen();
  console.log(leerlingen);

  if (!leerlingen || leerlingen.length === 0)
    return SendResponse(
      {
        success: false,
        message: "Failed to fetch leerlingen",
      },
      500
    );

  return SendResponse({ success: true, leerlingen });
}

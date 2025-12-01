import { AddLeerling } from "@/database";
import { SendResponse } from "@/services/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    
    if (!text || text.trim() === '') {
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
      console.error('JSON parse error:', parseError);
      return SendResponse(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        400
      );
    }
    
    if (!body?.naam || body.naam.trim() === '') {
      return SendResponse(
        {
          success: false,
          message: "Naam is required",
        },
        400
      );
    }

    console.log('Attempting to add leerling:', body.naam);
    const result = AddLeerling(body.naam.trim());
    console.log('Add result:', result);

    if (!result.success) {
      return SendResponse(
        {
          success: false,
          message: result.message,
        },
        500
      );
    }

    return SendResponse({ 
      success: true,
      message: result.message,
      id: result.id
    }, 201);
    
  } catch (error) {
    console.error('Route error:', error);
    return SendResponse(
      {
        success: false,
        message: "An error occurred while adding leerling",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}

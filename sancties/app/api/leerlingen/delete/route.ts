import { DeleteLeerling } from "@/database";
import { SendResponse } from "@/services/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('=== DELETE REQUEST DEBUG ===');
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    // Check of er überhaupt een body is
    const text = await req.text();
    console.log('Raw body text:', text);
    console.log('Body length:', text.length);
    
    if (!text || text.trim() === '') {
      console.error('Body is empty!');
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
      console.log('Parsed body:', body);
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
    
    if (!body?.id) {
      console.error('No ID in body:', body);
      return SendResponse(
        {
          success: false,
          message: "Leerling ID is required",
        },
        400
      );
    }

    console.log('Attempting to delete leerling with ID:', body.id);
    const deleted = DeleteLeerling(body.id);
    console.log('Delete result:', deleted);

    if (!deleted) {
      return SendResponse(
        {
          success: false,
          message: "Failed to delete leerling or leerling not found",
        },
        404
      );
    }

    return SendResponse({ 
      success: true,
      message: "Leerling successfully deleted"
    });
    
  } catch (error) {
    console.error('Route error:', error);
    return SendResponse(
      {
        success: false,
        message: "An error occurred while deleting leerling",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}
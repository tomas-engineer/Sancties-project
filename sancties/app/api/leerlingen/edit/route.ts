import { EditLeerling, AddSanctieToLeerling, RemoveSanctieFromLeerling, SetSanctiesForLeerling } from "@/database";
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

    const editType = body.editType || 'naam'; // 'naam', 'addSanctie', 'removeSanctie', or 'setSancties'

    // Edit naam
    if (editType === 'naam') {
      const { id, naam } = body;
      
      if (!id || !naam) {
        return SendResponse(
          {
            success: false,
            message: "Leerling ID and naam are required",
          },
          400
        );
      }

      console.log('Attempting to edit leerling naam:', id, naam);
      const edited = EditLeerling(id, naam);
      console.log('Edit result:', edited);

      if (!edited) {
        return SendResponse(
          {
            success: false,
            message: "Failed to edit leerling or leerling not found",
          },
          404
        );
      }

      return SendResponse({ 
        success: true,
        message: "Leerling naam successfully edited"
      });
    }

    // Set all sancties at once
    if (editType === 'setSancties') {
      const { leerlingId, sanctieIds } = body;
      
      if (!leerlingId) {
        return SendResponse(
          {
            success: false,
            message: "leerlingId is required",
          },
          400
        );
      }

      if (!Array.isArray(sanctieIds)) {
        return SendResponse(
          {
            success: false,
            message: "sanctieIds must be an array",
          },
          400
        );
      }

      console.log('Attempting to set sancties for leerling:', leerlingId, 'with IDs:', sanctieIds);
      const result = SetSanctiesForLeerling(leerlingId, sanctieIds);

      if (!result.success) {
        // Check for FOREIGN KEY constraint error
        let errorMessage = result.message;
        if (result.message.includes('FOREIGN KEY')) {
          errorMessage = "One or more Sanctie IDs do not exist";
        }
        
        return SendResponse(
          {
            success: false,
            message: errorMessage,
          },
          400
        );
      }

      return SendResponse({ 
        success: true,
        message: result.message
      });
    }

    // Add or remove sanctie
    if (editType === 'addSanctie' || editType === 'removeSanctie') {
      const { leerlingId, sanctieId } = body;
      
      if (!leerlingId || !sanctieId) {
        return SendResponse(
          {
            success: false,
            message: "leerlingId and sanctieId are required",
          },
          400
        );
      }

      console.log('Attempting to', editType, 'sanctie:', sanctieId, 'to/from leerling:', leerlingId);

      if (editType === 'removeSanctie') {
        const result = RemoveSanctieFromLeerling(leerlingId, sanctieId);
        if (!result) {
          return SendResponse(
            {
              success: false,
              message: "Failed to remove sanctie or combination not found",
            },
            404
          );
        }
        return SendResponse({ 
          success: true,
          message: "Sanctie successfully removed from leerling"
        });
      } else {
        const result = AddSanctieToLeerling(leerlingId, sanctieId);
        if (!result.success) {
          // Check for FOREIGN KEY constraint error
          let errorMessage = result.message;
          if (result.message.includes('FOREIGN KEY')) {
            errorMessage = "Leerling ID or Sanctie ID does not exist";
          } else if (result.message.includes('already')) {
            errorMessage = "This sanctie is already assigned to this leerling";
          }
          
          return SendResponse(
            {
              success: false,
              message: errorMessage,
            },
            result.message.includes('already') ? 409 : 400
          );
        }
        return SendResponse({ 
          success: true,
          message: result.message
        });
      }
    }

    return SendResponse(
      {
        success: false,
        message: "Invalid editType. Use 'naam', 'addSanctie', 'removeSanctie', or 'setSancties'",
      },
      400
    );
    
  } catch (error) {
    console.error('Route error:', error);
    return SendResponse(
      {
        success: false,
        message: "An error occurred while editing leerling",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}

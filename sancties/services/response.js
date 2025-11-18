export function SendResponse(message, status = 200) {
    return new Response(JSON.stringify(message), {
        status
    });
};
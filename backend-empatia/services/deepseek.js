require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.LLAMA_API_KEY,
    baseURL: process.env.LLAMA_BASE_URL,
});

async function processMessage(message, context = null) {

    console.log('Mensaje recibido:', message);
    console.log('Contexto:', context);

    try {
        let systemPrompt = `Eres un asistente especializado en evaluar y mejorar la cordialidad de mensajes. Tu tarea es:

        1. Analizar el nivel de cordialidad del mensaje proporcionado en una escala del 1 al 10 (donde 1 es muy descortés y 10 es muy cordial).
        2. Si el nivel de cordialidad es 9 o menor, reescribe el mensaje para que sea más cordial y profesional, manteniendo su significado original.
        3. Si el nivel de cordialidad es 10 o mayor, devuelve el mensaje original sin cambios.

        IMPORTANTE: 
        - Mantén siempre la perspectiva correcta del mensaje
        - Si es una asignación de tarea (sin contexto), el mensaje debe estar dirigido HACIA la persona que realizará la tarea (segunda persona: "te", "usted", "podrías", etc.)
        - Si es una respuesta a una asignación (con contexto), el mensaje debe estar escrito DESDE la perspectiva de quien responde (primera persona: "yo", "me", "he completado", etc.)
        - NO agregues notas, explicaciones o comentarios adicionales
        - Responde ÚNICAMENTE con el formato solicitado

        Formato de respuesta estricto:
        - Si necesita mejora: "REESCRITO: [mensaje mejorado]"
        - Si no necesita mejora: "ORIGINAL: [mensaje original]"
        
        NO agregues texto adicional, notas o explicaciones fuera de este formato.`;

        if (context) {
            systemPrompt += `

        CONTEXTO ADICIONAL: Este mensaje es una respuesta a la siguiente asignación de tarea:
        "${context.mensaje_original}"

        Como es una RESPUESTA, debe estar escrita en primera persona desde la perspectiva de quien está respondiendo.`;
        } else {
            systemPrompt += `
        CONTEXTO: Este es un mensaje de ASIGNACIÓN de tarea, por lo tanto debe estar dirigido hacia la persona que realizará la tarea (segunda persona: "te encargo", "podrías hacer", "necesito que realices", etc.).`;
        }

        systemPrompt += `Analiza el siguiente mensaje: "${message}"`;

        const completion = await openai.chat.completions.create({
            model: 'meta/llama3-8b-instruct', // Using LLaMA model from your first code
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                { role: 'user', content: message },
            ],
            temperature: 0.5, // Consistent with your first code
            top_p: 1, // Consistent with your first code
            max_tokens: 1024, // Consistent with your first code
            stream: false, // Changed to false to match the second code's structure
        });

        const responseContent = completion.choices[0].message.content;
        console.log('Respuesta completa de IA:', responseContent);

        // Extract the final message based on the response format
        // Handle cases where the response includes additional information like "Nivel de cordialidad: X"
        let cleanMessage = responseContent;

        // Look for "REESCRITO:" pattern, even if it has additional text before it
        if (responseContent.includes('REESCRITO:')) {
            const reescritoIndex = responseContent.indexOf('REESCRITO:');
            cleanMessage = responseContent.substring(reescritoIndex + 'REESCRITO:'.length);

            // Remove everything after the first line break or after quotes close
            cleanMessage = cleanMessage.split('\n')[0]; // Take only the first line
            cleanMessage = cleanMessage.trim();

            // Remove quotes if they exist at the beginning and end
            cleanMessage = cleanMessage.replace(/^["']|["']$/g, '');

            // Remove any trailing punctuation that might be artifacts (like \" or extra quotes)
            cleanMessage = cleanMessage.replace(/\\?["']+\s*$/, '');
        }
        // Look for "ORIGINAL:" pattern, even if it has additional text before it
        else if (responseContent.includes('ORIGINAL:')) {
            const originalIndex = responseContent.indexOf('ORIGINAL:');
            cleanMessage = responseContent.substring(originalIndex + 'ORIGINAL:'.length);

            // Remove everything after the first line break
            cleanMessage = cleanMessage.split('\n')[0]; // Take only the first line
            cleanMessage = cleanMessage.trim();

            // Remove quotes if they exist at the beginning and end
            cleanMessage = cleanMessage.replace(/^["']|["']$/g, '');

            // Remove any trailing punctuation that might be artifacts
            cleanMessage = cleanMessage.replace(/\\?["']+\s*$/, '');
        }
        // If neither pattern is found, try to extract just the message part
        else {
            // Try to find a quoted message at the end
            const quotedMessageMatch = responseContent.match(/"([^"]+)"[^"]*$/);
            if (quotedMessageMatch) {
                cleanMessage = quotedMessageMatch[1];
            }
        }

        console.log('Mensaje limpio extraído:', cleanMessage);
        return cleanMessage;
    } catch (error) {
        console.error('Error en NVIDIA API:', error.response?.data || error.message);
        return message; // Fallback: return original message
    }
}

module.exports = { processMessage };
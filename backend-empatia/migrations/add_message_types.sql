-- Agregar nuevas columnas para manejar mensajes y respuestas originales/cordiales

-- Agregar columnas para mensajes
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS mensaje_original TEXT,
ADD COLUMN IF NOT EXISTS tipo_mensaje_seleccionado VARCHAR(20) DEFAULT 'cordial';

-- Agregar columnas para respuestas
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS respuesta_original TEXT,
ADD COLUMN IF NOT EXISTS tipo_respuesta_seleccionada VARCHAR(20) DEFAULT 'cordial';

-- Migrar datos existentes (opcional)
-- Para las tareas existentes, consideramos que el mensaje actual es el original
UPDATE tareas 
SET mensaje_original = mensaje, 
    tipo_mensaje_seleccionado = 'original' 
WHERE mensaje_original IS NULL;

-- Para las respuestas existentes, consideramos que la respuesta actual es la original
UPDATE tareas 
SET respuesta_original = respuesta, 
    tipo_respuesta_seleccionada = 'original' 
WHERE respuesta IS NOT NULL AND respuesta_original IS NULL;

-- Agregar comentarios a las columnas
COMMENT ON COLUMN tareas.mensaje_original IS 'Mensaje original antes de ser procesado por IA';
COMMENT ON COLUMN tareas.tipo_mensaje_seleccionado IS 'Tipo de mensaje seleccionado: original o cordial';
COMMENT ON COLUMN tareas.respuesta_original IS 'Respuesta original antes de ser procesada por IA';
COMMENT ON COLUMN tareas.tipo_respuesta_seleccionada IS 'Tipo de respuesta seleccionada: original o cordial';

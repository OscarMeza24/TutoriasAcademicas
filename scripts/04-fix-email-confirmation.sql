-- Deshabilitar la confirmación de email para desarrollo (opcional)
-- NOTA: En producción, mantener la confirmación habilitada por seguridad

-- Verificar usuarios no confirmados
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- Para desarrollo: confirmar emails automáticamente (SOLO PARA DESARROLLO)
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    updated_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Alternativa: Crear función para confirmar emails manualmente
CREATE OR REPLACE FUNCTION confirm_user_email(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW(), 
      updated_at = NOW()
  WHERE email = user_email AND email_confirmed_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Uso: SELECT confirm_user_email('usuario@email.com');

-- Script adicional para asegurar que las políticas RLS funcionen correctamente

-- Verificar que RLS esté habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Crear políticas más simples y permisivas
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE 
USING (auth.uid() = id);

-- Asegurar que la función tenga los permisos correctos
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;

-- Verificar que el trigger esté activo
SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;

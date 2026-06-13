import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL precisa ser uma URL valida'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY e obrigatoria'),
})

const result = envSchema.safeParse(import.meta.env)

if (!result.success) {
  throw new Error(`Configuracao de ambiente invalida: ${result.error.message}`)
}

function getSupabaseProjectUrl(value: string) {
  return new URL(value).origin
}

export const env = {
  supabaseUrl: getSupabaseProjectUrl(result.data.VITE_SUPABASE_URL),
  supabaseAnonKey: result.data.VITE_SUPABASE_ANON_KEY,
}

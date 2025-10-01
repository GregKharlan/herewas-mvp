import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, next } = req.query;
  if (typeof code === 'string') {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  const redirectTo = typeof next === 'string' ? next : '/';
  res.redirect(redirectTo);
}

/*
create .env.local from root friend
from project setting, grab API, copy URL paste into SUPA URL in above
put process.env.SUPA URL inside createClient
similar
SUPA  KEY = ddd
NEXT_PUBLIC_SOME_VAR=23

*/

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

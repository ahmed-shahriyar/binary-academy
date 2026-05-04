import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type State = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAdminAuth() {
  const [state, setState] = useState<State>({
    loading: true,
    userId: null,
    email: null,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (mounted) setState({ loading: false, userId: null, email: null, isAdmin: false });
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (mounted) {
        setState({
          loading: false,
          userId,
          email,
          isAdmin: !error && data === true,
        });
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      check(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

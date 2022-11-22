DROP TRIGGER IF EXISTS user_account on public.users;

CREATE TRIGGER user_account
AFTER
INSERT
    ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
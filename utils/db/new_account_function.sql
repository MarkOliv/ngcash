create
or replace function handle_new_user() returns trigger as $ $ begin IF new.user_id IS NOT NULL THEN
INSERT INTO
    public.accounts("user_id", "balance",)
VALUES
    (new.user_id, 100);

RETURN NEW;

ELSE RETURN NEW;

END IF;

END;

$ $ language plpgsql;
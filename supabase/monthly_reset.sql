-- 1. Enable the pg_cron extension (if not already enabled)
create extension if not exists pg_cron;

-- 2. Create a function that resets the counts
create or replace function reset_monthly_exports()
returns void as $$
begin
  update profiles
  set monthly_export_count = 0;
end;
$$ language plpgsql;

-- 3. Schedule this function to run at midnight on the 1st of every month
-- Cron Syntax: min hour day month day-of-week
-- '0 0 1 * *' = At 00:00 on day-of-month 1.
select cron.schedule(
  'reset-monthly-exports', -- name of the cron job
  '0 0 1 * *',             -- schedule
  $$select reset_monthly_exports()$$
);

-- Optional: To verify it works, you can manually run:
-- select reset_monthly_exports();

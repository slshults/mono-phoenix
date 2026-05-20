ExUnit.start()
# Only the Accounts repo is used in Phase 1 tests. The main MonoPhoenixV01.Repo
# is not put in sandbox mode here because the `test` mix alias deliberately
# doesn't create/migrate its test DB (no Phase 1 tests touch monologues data).
# Add `Sandbox.mode(MonoPhoenixV01.Repo, :manual)` back here when the first
# test that touches the main repo lands (likely Phase 2+ with favorites).
Ecto.Adapters.SQL.Sandbox.mode(MonoPhoenixV01.Accounts.Repo, :manual)

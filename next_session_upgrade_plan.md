# 🎯 FOCUSED 2-DAY ACTION PLAN
## Next Session: Local Upgrade & Config Cleanup

### **Phase 1: Config Cleanup (30 minutes)**

**Immediate Action Required in `/home/steven/webdev/elixir/mono_phoenix_v01/config/prod.exs`:**

```elixir
# REMOVE this Heroku-hardcoded section:
config :mono_phoenix_v01, MonoPhoenixV01.Repo,
  url: "postgres://username:password@host:port/database",
  pool_size: 18

# REPLACE with environment variables:
config :mono_phoenix_v01, MonoPhoenixV01.Repo,
  url: System.get_env("DATABASE_URL"),
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
```

### **Phase 2: Version Upgrades (2-3 hours)**

**Critical Order - Don't Skip Steps:**

1. **Update system versions first** (via asdf/version manager)
   - Erlang/OTP 24 → 27.3.4.1  
   - Elixir 1.14.1 → 1.18.4

2. **Update mix.exs dependencies** (one section at a time):
   ```elixir
   # Core Phoenix updates:
   {:phoenix, "~> 1.8.0"}
   {:phoenix_live_view, "~> 1.0.0"}
   {:phoenix_html, "~> 4.1"}
   {:phoenix_live_dashboard, "~> 0.8"}
   
   # Keep existing versions for now:
   {:ecto_sql, "~> 3.6"} # Don't jump to 3.12 yet
   {:postgrex, ">= 0.0.0"} # Keep flexible
   ```

3. **Run upgrade sequence:**
   ```bash
   mix deps.clean --all
   mix deps.get
   mix compile
   ```

### **Phase 3: Critical Testing (1 hour)**

**Test in this exact order:**
1. `mix phx.server` - Does it start?
2. Visit `/home` - Basic LiveView working?
3. Search functionality - Is debouncing still working?
4. PostHog events - Check browser console for errors
5. Asset compilation - Any CSS/JS issues?

### **🚨 KNOWN BREAKING CHANGES TO WATCH:**

**Phoenix 1.7.1 → 1.8.0:**
- LiveView mount parameters might need adjustment
- Heex template syntax changes (rare but possible)
- Asset pipeline configuration may need tweaks

**Elixir 1.14 → 1.18:**
- Deprecation warnings (won't break, but good to note)
- Some Enum functions have optimizations

**Erlang/OTP 24 → 27:**
- SSL/TLS changes (shouldn't affect local dev)
- Some crypto functions updated

### **🎯 SUCCESS CRITERIA:**
- [x] Local server starts without errors
- [x] Can browse `/plays` and `/mens` pages
- [x] Search works and debounces properly  
- [x] PostHog tracking fires (check Network tab)
- [x] No JavaScript console errors

### **⚡ QUICK WINS TO PRIORITIZE:**
1. **Config cleanup first** - This unblocks everything else
2. **Version updates in one session** - Don't spread across days
3. **Test immediately after each major change** - Catch issues early

**Time Budget:**
- Day 1: Config cleanup + version upgrades + basic testing (3-4 hours)
- Day 2: Thorough testing + any issue resolution (2-3 hours)

This keeps Steven moving fast while ensuring the foundation is solid before touching Gigalixir! The key is doing the config cleanup FIRST so there are no surprises when testing the upgrades.
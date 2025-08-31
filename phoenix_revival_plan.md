# Shakespeare Monologues Site Revival Plan 🎭

## Phase 1: Environment Setup & Assessment 🔧

### 1.1 Install Gigalixir CLI
```bash
# In your WSL2/Ubuntu environment
pip3 install gigalixir
gigalixir login
# (Create account first at gigalixir.com)
```

### 1.2 Assess Current Codebase
- [ ] Clone your GitHub repo locally (if not already)
- [ ] Check current Phoenix version (mix.exs)
- [ ] Review your production DB backup
- [ ] Document any custom configurations or environment variables

### 1.3 Version Compatibility Check & Upgrade Path
**Your current versions:**
- Erlang/OTP 24
- Elixir 1.14.1  
- Phoenix 1.7.1
- PostgreSQL 14.6

**Current stable versions (August 2025):**
- Erlang/OTP 27.3.4 (recommended by Gigalixir)
- Elixir 1.18.4-otp-27 (requires Erlang 26+)
- Phoenix 1.8.0 (released Aug 2025, requires Erlang/OTP 25+)
- PostgreSQL 15+ (supported by Gigalixir)

**Recommended upgrade strategy:**
- [ ] **Option A**: Deploy current versions first (1.7.1 + OTP 24 + Elixir 1.14.1), then upgrade after site is live
- [ ] **Option B**: Upgrade locally first, then deploy latest versions

**Version compatibility matrix (verified August 2025):**
- Phoenix 1.8.0 requires Erlang/OTP 25+
- Elixir 1.18.4 requires Erlang/OTP 26+ (minimum)
- Gigalixir recommends: Erlang/OTP 27.3.4 + Elixir 1.18.4-otp-27
- **Recommended combination:** Erlang/OTP 27.3.4 + Elixir 1.18.4-otp-27 + Phoenix 1.8.0

## Phase 2: Version Upgrade Strategy 🔧

### 2.1 Mandatory Upgrade Path
**Reality Check:** Gigalixir likely won't support your older versions anymore (just like Heroku dropped support for older stacks). 

**The Only Path Forward:**
1. Get your current app running locally with old versions
2. Upgrade everything to latest versions locally
3. Test thoroughly until it works
4. Commit and push to GitHub
5. Deploy to Gigalixir with modern versions

This is actually better long-term - you'll have the latest security patches and performance improvements!

### 2.2 Local Environment Setup & Upgrade

#### Step 1: Install Latest Erlang/OTP & Elixir
```bash
# In WSL2/Ubuntu - Install asdf version manager
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc
source ~/.bashrc

# Add Erlang and Elixir plugins
asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git

# Install current stable versions (Gigalixir-recommended)
asdf install erlang 27.3.4.1
asdf install elixir 1.18.4-otp-27

# Set versions (use 'asdf set' for asdf 0.16+, 'asdf local' for older versions)
asdf set erlang 27.3.4.1
asdf set elixir 1.18.4-otp-27

# Verify installation
elixir --version
erl -eval 'erlang:display(erlang:system_info(otp_release)), halt().' -noshell
```

#### Step 2: Upgrade Phoenix & Dependencies
```bash
# Remove old Phoenix generator
mix archive.uninstall phx_new

# Install Phoenix 1.8.0 generator
mix archive.install hex phx_new 1.8.0

# Update your project dependencies in mix.exs
{:phoenix, "~> 1.8.0"},
{:phoenix_ecto, "~> 4.6"},
{:ecto_sql, "~> 3.11"},
{:phoenix_html, "~> 4.0"},
{:phoenix_live_view, "~> 1.1"},
{:phoenix_live_dashboard, "~> 0.8"},
{:postgrex, ">= 0.0.0"}, # Already compatible
{:jason, "~> 1.2"}, # Already compatible
{:plug_cowboy, "~> 2.7"}
```

#### Step 3: Update Dependencies & Resolve Breaking Changes
```bash
# Update dependencies
mix deps.get
mix deps.compile

# Check for deprecation warnings
mix compile --warnings-as-errors

# Address Phoenix 1.8.0 breaking changes:
# - Update config/prod.exs for new security headers
# - Add :formats option to controllers if needed
# - Update any deprecated router helpers
```

#### Step 4: Test Upgraded App Locally
```bash
# Run tests
mix test

# Start server and verify functionality
mix phx.server
```

#### Step 5: Commit Your Upgrade
```bash
# After everything is working locally
git add .
git commit -m "Upgrade to Phoenix 1.8.0, Elixir 1.18.4-otp-27, Erlang/OTP 27.3.4.1"
git push origin main
```

## Phase 3: Local Development Environment 🏠

### 3.1 Get Old App Running First
- [ ] Clone your GitHub repo (if not already local)
- [ ] Try to run with current system versions first
- [ ] Document any immediate issues
- [ ] Get baseline functionality working

### 3.2 Database Restoration  
- [ ] Set up local PostgreSQL in WSL2
- [ ] Restore your production backup locally
- [ ] Verify data integrity
- [ ] Test all database migrations with old versions

### 3.3 Then Upgrade & Test
- [ ] Follow the upgrade steps above (Phase 2.2)
- [ ] Run `mix deps.get` to install new dependencies
- [ ] Fix any compilation errors from version changes
- [ ] Run `mix test` to check for breaking changes
- [ ] Start Phoenix server: `mix phx.server`
- [ ] Test all critical functionality thoroughly
- [ ] Make sure everything works before proceeding

## Phase 4: Gigalixir Deployment Prep 🚀

### 4.1 Create Gigalixir App
```bash
# In your project directory
gigalixir create shakespeare-monologues
# (or whatever name you prefer)
```

### 4.2 Configure Production Settings
- [ ] Update `config/prod.exs` for Gigalixir environment
- [ ] Set up `config/runtime.exs` for environment variables
- [ ] Configure database connection settings
- [ ] Set up secret key base generation

### 4.3 Environment Variables Setup
Critical variables to configure:
- [ ] `SECRET_KEY_BASE`
- [ ] `DATABASE_URL` (auto-created by Gigalixir)
- [ ] Any custom app-specific variables
- [ ] Third-party API keys (if any)

## Phase 5: Database Migration to Gigalixir 📊

### 5.1 Create Gigalixir Database
```bash
# Start with the 0.6 size ($25/month)
gigalixir pg:create --size=0.6
```

### 5.2 Database Data Migration Options
**Option A: Dump & Restore**
- Export from local backup: `pg_dump`
- Import to Gigalixir: `gigalixir pg:psql < backup.sql`

**Option B: Direct Migration**
- Use `pg_dump` from your local backup
- Pipe directly to Gigalixir database

### 5.3 Verify Database Migration
- [ ] Connect to Gigalixir database
- [ ] Verify table structure
- [ ] Check row counts match
- [ ] Test critical queries

## Phase 6: Application Deployment 🎯

### 6.1 Initial Deployment
```bash
# Deploy from your main branch
git push gigalixir main
```

### 6.2 Post-Deployment Verification
- [ ] Check deployment logs: `gigalixir logs`
- [ ] Verify app is running: `gigalixir ps`
- [ ] Test the deployed URL
- [ ] Run database migrations if needed: `gigalixir run mix ecto.migrate`

### 6.3 Domain Configuration
- [ ] Set up custom domain in Gigalixir
- [ ] Update DNS settings in Dreamhost
- [ ] Configure SSL (automatic with Gigalixir)
- [ ] Test domain resolution

## Phase 7: Performance & Production Readiness 🎪

### 7.1 Monitoring Setup
- [ ] Configure log aggregation
- [ ] Set up basic health checks
- [ ] Monitor memory usage
- [ ] Check response times

### 7.2 Scaling Assessment
- [ ] Monitor initial resource usage
- [ ] Adjust replica size if needed
- [ ] Consider database scaling if required

### 7.3 Backup Verification
- [ ] Confirm automatic backups are working
- [ ] Test backup restoration process
- [ ] Document recovery procedures

## Phase 8: Go Live! 🌟

### 8.1 Final Testing
- [ ] Full site functionality test
- [ ] Mobile responsiveness check
- [ ] SEO/search indexing verification
- [ ] Performance benchmarking

### 8.2 Launch
- [ ] Update any external links/references
- [ ] Notify stakeholders (if applicable)
- [ ] Monitor for 24-48 hours post-launch
- [ ] Document any issues and resolutions

## Emergency Rollback Plan 🚨

If something goes wrong:
- [ ] Keep local development environment ready
- [ ] Have database backup restoration process documented
- [ ] Know how to quickly scale down/pause Gigalixir resources
- [ ] Have contact info for Gigalixir support

## Estimated Timeline ⏱️

- **Phase 1:** 1 day (environment setup & Gigalixir CLI)
- **Phase 2:** 2-3 days (mandatory upgrades & local testing)
- **Phase 3:** 1 day (database restoration & final local testing)
- **Phase 4:** 1 day (Gigalixir prep)
- **Phase 5:** 1-2 days (database migration)
- **Phase 6:** 1 day (deployment)
- **Phase 7-8:** 1-2 days (polish & launch)

**Total: ~1.5-2 weeks** (the upgrade work adds some time but ensures compatibility)

## Cost Breakdown 💰

**Monthly Operating Costs:**
- App hosting (0.5GB): $25/month
- Database (0.6 size): $25/month
- **Total: ~$50/month**

**Setup Costs:**
- Gigalixir account: Free
- Domain/DNS: Already have with Dreamhost

## Key Version Upgrade Benefits 🔥

**Phoenix 1.8.0 New Features:**
- Built-in dark mode support
- Magic link authentication (passwordless login)
- Enhanced Tailwind CSS with daisyUI components  
- Improved scoped data access patterns
- AGENTS.md file for better LLM-assisted development
- Better security headers and CSP policies

**Elixir 1.18.4 Improvements:**
- Compiler performance improvements (up to 2x faster)
- Better parallel compilation
- Enhanced editor tooling integration
- Improved error handling

**Erlang/OTP 27+ Benefits:**
- Performance improvements
- Better memory management
- Enhanced security features

*This plan assumes your codebase is in good shape. We'll adjust as needed based on what we find during the assessment phase!*
# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is a Phoenix 1.8.1 application for Shakespeare's Monologues website (shakespeare-monologues.org), built with Elixir 1.18.4 + OTP 27.3.4 and using PostgreSQL as the database. The application serves monologues from Shakespeare's plays with gender-specific browsing (mens/womens/both) and search functionality.

**MIGRATION STATUS:** Successfully migrated from Heroku to Gigalixir on August 31, 2025. Site is fully operational at shakespeare-monologues.org.

## Current documenation
NOTE: Your training data set is woefully outdated. We're starting this revival project on 08/31/2025 at 2:40 PM PDT. NEVER make assumptions based on your outdated training data set. ALWAYS use your websearch tool to get correct and current information from the sources in the list below.

Search these documents instead of playing trial and error games. 

Our authoritative sources for docs for this project are:
- https://hexdocs.pm/phoenix
- https://www.erlang.org/docs
- https://elixir-lang.org/docs.html
- https://hexdocs.pm/phoenix/gigalixir.html
- https://www.gigalixir.com/docs
- http://posthog.com/docs

#### Division of Responsibilities

This is IMPORTANT for managing rate-limiting and billing efficiency. 

**Sonnet 4 should be the default model** since Task tool calls are billed under the calling model's usage:

**Sonnet 4 Role** claude-sonnet-4-20250514 (Default & Implementation):
- File editing and code changes
- Direct implementation of planned features
- Routine refactoring and code updates
- Following established patterns and conventions
- Executing well-defined tasks with clear requirements
- Basic debugging and troubleshooting
- Most day-to-day development work

**Opus 4.1 Role** claude-opus-4-1-20250805 (Complex Analysis via Task Tool):
- Complex analysis and architectural decisions
- Multi-file code investigation and understanding
- Task planning and breaking down requirements
- Code review and verification of implementations
- Handling complex debugging and system-level issues
- Multi-system reasoning and integration problems

#### When to Use the Task Tool

**Sonnet should delegate to Opus for:**
- Initial codebase exploration and analysis
- Complex architectural decisions
- Multi-system debugging
- Planning and requirement analysis
- Tasks requiring deep reasoning about system interactions
- Complex refactoring that affects multiple files/systems

**Sonnet should handle directly:**
- Making edits to existing files
- Implementing features with clear requirements
- Following established patterns (e.g., adding new API endpoints)
- Routine code updates and maintenance tasks
- Straightforward bug fixes and improvements

#### Best Practices

1. **Clear Task Definitions**: When using the Task tool, provide specific, actionable instructions
2. **Context Preservation**: Include relevant file paths, function names, and implementation details
3. **Pattern References**: Point Sonnet to existing examples in the codebase to follow
4. **Success Criteria**: Define what "done" looks like for the delegated task

### Debuggging:

When you hand off to Opus 4.1 for troubleshooting, please remind them to:
- Review the current conversation thus far
- Review the project CLAUDE.md file
- Tail `logs.gpr` to view the details of the most recent test
- Search the web for any details needed about how SVGuitar works as of late 2025 (do not make assumptions, your training data set is outdated)
This approach helps Steven stay within API rate limits while getting the best capabilities from both model types.

Also, when handing off tasks to Opus, please speak to them like they're a person, the same way I speak to you (instead of barking orders at them as if they're just a dumb command line.)

## Development Commands

### Essential Commands
- `mix deps.get` - Install dependencies
- `mix ecto.setup` - Set up database (create, migrate, seed)
- `mix ecto.reset` - Drop and recreate database
- `mix phx.server` - Start Phoenix server (runs on port 4000)
- `iex -S mix phx.server` - Start server in interactive Elixir shell

### Database Commands
- `mix ecto.create` - Create database
- `mix ecto.migrate` - Run migrations
- `mix ecto.rollback` - Rollback migrations
- `run priv/repo/seeds.exs` - Seed database

### Testing & Code Quality
- `mix test` - Run tests (creates test DB first)
- `mix credo` - Static code analysis with Credo

### Asset Building
- `mix assets.deploy` - Build and digest assets for production
- ESBuild is configured to watch assets in development mode

## Application Architecture

### Database
- Uses PostgreSQL
- Development database: `copyOfProdDBforTest`
- Main schema table: `titles` (mapped by `MonoPhoenixV01.Play`)
- Database connection pool size: 18

### Phoenix Structure
- **Application**: `MonoPhoenixV01.Application`
- **Repo**: `MonoPhoenixV01.Repo`
- **Endpoint**: `MonoPhoenixV01Web.Endpoint`
- **Router**: `MonoPhoenixV01Web.Router`

### Key Features
- **LiveView**: Extensive use of Phoenix LiveView for interactive pages
- **Search**: Multiple search implementations (general, men-specific, women-specific)
- **SEO Redirects**: Comprehensive redirect mapping from old URLs to new structure
- **PostHog Analytics**: Integrated with posthog-js for user tracking

### Route Structure
```
/home           - Homepage (redirected from /)
/plays          - All plays listing (LiveView)
/play/:playid   - Individual play page (LiveView)
/mens           - Men's plays listing (LiveView)
/men/:playid    - Men's play page (LiveView)
/womens         - Women's plays listing (LiveView)
/women/:playid  - Women's play page (LiveView)
/monologues/:monoid - Monologue detail page
/search_*       - Various search interfaces (LiveView)
```

### LiveView Pages
- `PlaysPageLive` - All plays listing
- `PlayPageLive` - Individual play display
- `MenplaysPageLive` / `MenplayPageLive` - Men's content
- `WomenplaysPageLive` / `WomenplayPageLive` - Women's content
- `SearchBarLive`, `SearchByPlayLive` etc. - Search functionality

### Static Pages
Handled by `StaticPageController`:
- /aboutus, /faq, /home, /links, /privacy, /maintenance

## Development Environment

### Requirements
- Elixir 1.12+ with Erlang/OTP 24+
- PostgreSQL
- Node.js (for asset compilation)

### Configuration
- Development server binds to all interfaces (0.0.0.0:4000) for WSL compatibility
- Live reload watches templates, views, and assets
- ESBuild handles JavaScript bundling with source maps in development

### Assets
- Located in `/assets` directory
- CSS in `/assets/css`
- JavaScript in `/assets/js`
- Vendor assets in `/assets/vendor`
- PostHog integration for analytics

## Code Patterns

### Data Access
- Most database queries are implemented directly in LiveView modules and controllers
- The `Play` schema is minimal - most data access happens through raw Ecto queries
- No dedicated context modules - business logic is in the LiveView/controller layer

### Redirects
- Extensive SEO redirect mapping in router for backward compatibility
- Uses the `redirect` library for permanent redirects with query string preservation

## Important Notes

- Be security conscious. Do not make suggestions which compromise security. Call me out if I make choices which compromise security.
- The application uses PostHog for analytics tracking
- Database contains production data copy for development
- No formal test suite currently exists (test directory not present)
- Focus on gender-specific content organization (mens/womens/both categorization)
- DO NOT run git commands. Ask me to run them in an external terminal (This is primarily for `commit` and `push`. There may be scenarious where you'll need to use git (diff, etc), but let's discuss first, please)
- When Steven shares screenshots or other files with you, you'll find them in `D:\Users\Steven\Documents\Shakes\2025revival\screenshots_etc` (You'll need to translate that Windows directory to a WSL2 directory path in order to access the contents.)



### Migration Success Notes (August 2025)

**Key Technical Solutions for Future Reference:**

**WebSocket/LiveView Issues:**
- Problem: WebSocket origin checking failures with custom domains
- Solution: Use `check_origin: :conn` in config/prod.exs (not endpoint.ex)
- This automatically matches request's host, port, and scheme

**Gigalixir SSL Certificates:**
- Fully automatic via cert-manager and Let's Encrypt
- No manual certificate upload needed
- Typical provisioning time: 15 minutes to 24 hours after DNS propagation
- Temporary "Kubernetes Ingress Controller Fake Certificate" is normal during provisioning

**Deployment Process:**
1. Set PHX_HOST environment variable to match your custom domain
2. Ensure DNS CNAMEs point to *.gigalixirdns.com endpoints  
3. SSL certificates provision automatically via cert-manager
4. Use `assets/package.json` with deploy script for proper asset compilation

### Current Status

My local computing and development environment includes:  
- Windows 11 Pro, v24H2, OS Build 26120.5770, Windows Feature Experience Pack 1000.26100.240.0
- WSL 2
- Ubuntu (bash sheel)
- VS Code (and I occasionally use emacs in my shell for quick tweaks to files outside of the project dir)
- `Claude Code` VS Code extension
- Committing and pushing to GitHub from my local

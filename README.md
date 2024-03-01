# Welcome to mono-phoenix

#### This is the repo for the code of the current version of the [Shakespeare's Monologues website](https://www.shakespeare-monologues.org/).

The code for the site is licensed under a [Creative Commons License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
© 1997-2024 Steven Shults & Brandon Faloona.
The content of Shakespeare's plays is in the public domain.

---
If you need to set up a new local environment for contributing to this site (or to [borrow some code for a project of your own](https://creativecommons.org/licenses/by-nc-sa/4.0/)), you'll need to get the [Phoenix Framework](https://www.phoenixframework.org/) working in your local environment first. Follow the instructions below, closely.

(**Note:**  The version numbers listed below are the versions that I used when I first starting working on porting this site from Ruby to Elixir. I suggest starting here, then following the Phoenix upgrade guides to get your local environment updated to the current production versions.  Get in touch if you need info about current versions of the elements listed below.)  


Do this stuff, in this order:

* **Use `asdf`** to install and maintain versions for elixir and erlang. 
	(Helps solve the version-pairing special needs, see:  https://hexdocs.pm/elixir/compatibility-and-deprecations.html#compatibility-between-elixir-and-erlang-otp )

1. Install `asdf` (dependencies, install commands for your machine, etc): https://asdf-vm.com/guide/getting-started.html

	* Use `asdf` to install `erlang`  : https://github.com/asdf-vm/asdf-erlang

	* Use `asdf` to install `elixir`  :  https://github.com/asdf-vm/asdf-elixir 
	
	You'll want to start with the install instructions on the git hub pages of course, but in case there are bumps on that route, this was a good resource for me: https://www.coletiv.com/blog/how-to-correctly-install-erlang-and-elixir/ 

	(If you get stuck, https://elixirforum.com are your friends.)

2. Your goal for this next step is to install `Erlang/OTP 24.3.4.7`, then `Elixir 1.12.2` compiled with `Erlang/OTP 24`.

	(I didn't make a note of the `asdf` command I installed with, but I think recall it involved using a commit id, or maybe a git-url)

	* `Erlang/OTP 24.3.4.7`: https://github.com/erlang/otp/releases/tag/OTP-24.3.4.7

	* `Elixir 1.12.2` : https://github.com/elixir-lang/elixir/releases/tag/v1.12.2

3. Install `Phoenix`
		https://hexdocs.pm/phoenix/installation.html

4. Create an empty site with these instructions at the link below. Instead of the example site name `hello`, use: `mono_phoenix_v01` (or your own project name if you are getting set up to borrow code, rather than contribute): https://hexdocs.pm/phoenix/up_and_running.html

You'll be ready to grab the repo now, but this page is a good quick orientation for how the data flows. If you are accustomed to Ruby, a lot of this will seem familiar, yet easier: https://hexdocs.pm/phoenix/request_lifecycle.html

-- Quoting below from the Phoenix `readme` --
To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [localhost:4000](http://localhost:4000) from your browser.


## Learn more about the Phoenix Framework

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix


# MonoPhoenixV01

Do this stuff in this order:

* Use asdf to install and maintain versions for elixir and erlang. 
	(Helps solve the version-pairing special needs, see:  https://hexdocs.pm/elixir/compatibility-and-deprecations.html#compatibility-between-elixir-and-erlang-otp )

* Install asdf (dependencies, install commands for your machine, etc): https://asdf-vm.com/guide/getting-started.html

	* Use asdf to install erlang  : https://github.com/asdf-vm/asdf-erlang

	* Use asdf to install elixir  :  https://github.com/asdf-vm/asdf-elixir 
	
	You'll want to start with the install instructions on the git hub pages of course, but in case there are bumps on that route, this was a good resource for me: https://www.coletiv.com/blog/how-to-correctly-install-erlang-and-elixir/ 

	If you get stuck, https:elixirforum.com is your friend. i haven't tried the site's own search because it's always high in google results, so keep an eye out for those links.

* Your goal for this step is to install Erlang/OTP 24.3.4.7, then Elixir 1.12.2 (compiled with Erlang/OTP 24)

	I didn't make a note of the asdf command I installed with, but I think recall it involved using a commit id, or maybe a git-url

	Erlang/OTP 24.3.4.7 : https://github.com/erlang/otp/releases/tag/OTP-24.3.4.7

	Elixir 1.12.2 : https://github.com/elixir-lang/elixir/releases/tag/v1.12.2

* Install Phoenix
		https://hexdocs.pm/phoenix/installation.html

* Create an empty site with these instructions.
	Instead of the example site name `hello`, use: `mono_phoenix_v01`
	https://hexdocs.pm/phoenix/up_and_running.html

You'll be ready to grab the repo now, but this page is a good quick orientation for how the data flows. A lot of it will seem familiar, yet easier:
https://hexdocs.pm/phoenix/request_lifecycle.html

-- Default readme copy follows --
To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix


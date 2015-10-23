# Sizung
## Setup

Install Ruby 2.2.x on your machine. Using `chruby` is recommended.
For more information see [Installing Ruby](https://www.ruby-lang.org/en/documentation/installation/#chruby).

Clone the git repo by running

```git clone git@github.com:Sizung/sizung.git```

Within the projects directory run

```bundle install```

And start the server

```rails s```

And start the node dev server for handling hot code reload for react

```node devServer.js```

## Deployment

We are using Heroku for deployment at the moment, so it's as easy as push it to the heroku remote branch.

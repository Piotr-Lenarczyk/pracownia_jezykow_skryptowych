local config = require("lapis.config")

config("development", {
  port = 8080,
  postgres = {
    host = "127.0.0.1",
    user = "myuser",
    password = "mypassword",
    database = "mydatabase"
  }
})


# Lua REST API

## Overview
This directory includes code for Lua REST API using Lapis web framework, defining CRUD endpoints for categories and products. Models use <code>lapis.db.model</code>.

## Preconditions
This program assumes that:
- Lua, LuaRocks and Lapis are installed
- Program is run locally
- Port 8080 is free and can be bound
- There is a postgreSQL database service running on the host
- There is a <i>mydatabase</i> schema created in the database
- There is a <i>myuser</i> user, authenticated by <i>mypassword</i> password
- There are <i>categories</i> and <i>products</i> tables defined in the database, which, in order to comply with design, can be defined as:
```
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```
```
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```
Alternatively, this configuration can altered in <b>config.lua</b>.

## Endpoints

Following endpoints are available, relative to the root and following REST conventions
- <code>/categories</code>
- <code>/products</code>

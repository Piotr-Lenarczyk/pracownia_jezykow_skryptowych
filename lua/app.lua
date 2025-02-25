local lapis = require("lapis")
local db = require("lapis.db")
local app = lapis.Application()
app:enable("etlua") -- Enables template rendering (optional)

local models = require("models")
local Category, Product = models.Category, models.Product

-- =================== CATEGORIES ENDPOINTS ===================

-- Get all categories
app:get("/categories", function()
  local categories = Category:select()
  return { json = { message = "Categories list", categories = categories } }
end)

-- Get a single category
app:get("/categories/:id", function(self)
  local category = Category:find(self.params.id)
  if category then
    return { json = category }
  else
    return { status = 404, json = { error = "Category not found" } }
  end
end)

-- Create a new category
app:post("/categories", function(self)
  local category = Category:create { name = self.params.name }
  return { status = 201, json = category }
end)

-- Update a category
app:put("/categories/:id", function(self)
  local category = Category:find(self.params.id)
  if category then
    category:update { name = self.params.name }
    return { json = category }
  else
    return { status = 404, json = { error = "Category not found" } }
  end
end)

-- Delete a category (cascades to products)
app:delete("/categories/:id", function(self)
  local category = Category:find(self.params.id)
  if category then
    category:delete()
    return { json = { message = "Category deleted", category = category } }
  else
    return { status = 404, json = { error = "Category not found" } }
  end
end)

-- =================== PRODUCTS ENDPOINTS ===================

-- Get all products
app:get("/products", function()
  local products = Product:select()
  return { json = { message = "Products list", products = products } }
end)

-- Get a single product
app:get("/products/:id", function(self)
  local product = Product:find(self.params.id)
  if product then
    return { json = product }
  else
    return { status = 404, json = { error = "Product not found" } }
  end
end)

-- Create a new product
app:post("/products", function(self)
  local product = Product:create {
    name = self.params.name,
    category_id = self.params.category_id,
    price = self.params.price
  }
  return { status = 201, json = product }
end)

-- Update a product
app:put("/products/:id", function(self)
  local product = Product:find(self.params.id)
  if product then
    product:update {
      name = self.params.name,
      category_id = self.params.category_id,
      price = self.params.price
    }
    return { json = product }
  else
    return { status = 404, json = { error = "Product not found" } }
  end
end)

-- Delete a product
app:delete("/products/:id", function(self)
  local product = Product:find(self.params.id)
  if product then
    product:delete()
    return { json = { message = "Product deleted", product = product } }
  else
    return { status = 404, json = { error = "Product not found" } }
  end
end)

return app

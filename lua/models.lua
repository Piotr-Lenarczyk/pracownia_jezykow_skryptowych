local Model = require("lapis.db.model").Model

-- Define Category model
local Category = Model:extend("categories")

-- Define Product model
local Product = Model:extend("products", {
  relations = {
    { "category", belongs_to = "Category" } -- Establishes foreign key relationship
  }
})

return {
  Category = Category,
  Product = Product
}


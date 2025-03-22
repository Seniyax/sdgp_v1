const supabase = require("../config/supabaseClient");
const { TABLES } = require("../config/constants");
const logger = require("../utils/logger");

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.image_url = data.image_url;
    this.status = data.status;
  }

  // Get all categories
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORY)
        .select("*")
        .order("id");

      if (error) throw error;
      return data.map((category) => new Category(category));
    } catch (error) {
      logger.error("Error getting all categories:", error);
      throw error;
    }
  }

  // Get category by ID
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORY)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data ? new Category(data) : null;
    } catch (error) {
      logger.error(`Error getting category ${id}:`, error);
      throw error;
    }
  }

  // Get active categories
  static async getActive() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORY)
        .select("*")
        .eq("status", "active")
        .order("id");

      if (error) throw error;
      return data.map((category) => new Category(category));
    } catch (error) {
      logger.error("Error getting active categories:", error);
      throw error;
    }
  }

  // Get businesses in category
  async getBusinesses(page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await supabase
        .from(TABLES.BUSINESS)
        .select("*", { count: "exact" })
        .eq("category_id", this.id)
        .range(from, to);

      if (error) throw error;
      return {
        businesses: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error(`Error getting businesses for category ${this.id}:`, error);
      throw error;
    }
  }
}

async function getCategoryId(categoryName) {
  const { data, error } = await supabase
    .from("category")
    .select("id")
    .eq("name", categoryName)
    .single();
  if (error) throw error;
  return data ? data.id : null;
}

async function getCategoryName(categoryId) {
  const { data, error } = await supabase
    .from("category")
    .select("name")
    .eq("id", categoryId)
    .single();
  if (error) throw error;
  return data ? data.name : null;
}

module.exports = { Category, getCategoryId, getCategoryName };

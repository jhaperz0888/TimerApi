const { query, pooling } = require("../database/Connection");

module.exports = async (queryStatement) => {
  try {
    const results = await query(queryStatement);

    return results;
  } catch (error) {
    throw error;
  }
};

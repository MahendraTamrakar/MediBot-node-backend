const fs = require("fs").promises;
const path = require("path");

const loadPromptTemplate = async () => {
  const filePath = path.join(__dirname, "..", "prompt_template.txt");
  return await fs.readFile(filePath, "utf-8");
};

module.exports = { loadPromptTemplate };

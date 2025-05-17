const { getResponseFromOllama } = require("../services/ollamaService");
const { loadPromptTemplate } = require("../utils/loadTemplate");

const handleChat = async (req, res) => {
  const userText = req.body.text;

  try {
    const template = await loadPromptTemplate();
    const finalPrompt = template.replace("{{message}}", userText.trim());

    const responseText = await getResponseFromOllama(finalPrompt);

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error in handleChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleChat };

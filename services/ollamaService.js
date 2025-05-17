const axios = require("axios");

const getResponseFromOllama = async (prompt) => {
  const url = "http://localhost:1234/v1/chat/completions";

  const response = await axios.post(url, {
    model: "mistral",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  }, {
    headers: { "Content-Type": "application/json" },
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    let fullResponse = "";

    response.data.on("data", (chunk) => {
      const str = chunk.toString();

      // Split stream chunk into lines
      const lines = str.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.replace(/^data: /, "").trim();

          if (dataStr === "[DONE]") {
            // Stream finished
            resolve(fullResponse);
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const contentPart = parsed.choices?.[0]?.delta?.content || "";
            fullResponse += contentPart;
          } catch (err) {
            console.error("Error parsing chunk JSON:", err);
            // Optional: reject(err);
          }
        }
      }
    });

    response.data.on("end", () => {
      // In case stream ends without [DONE]
      resolve(fullResponse);
    });

    response.data.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = { getResponseFromOllama };

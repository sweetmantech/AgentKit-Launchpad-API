import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import getChatCompletions from "../lib/getChatCompletions.js";
import tvly from "../lib/tavily/client.js";

export const get_dataset_status = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getActorStatus(datasetId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_items = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getDataset(datasetId);
    if (data?.[0]?.error)
      return res.status(500).json({ error: data?.[0]?.error });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_social_handles = async (req, res) => {
  const { handle } = req.query;
  try {
    const socials = ["tiktok", "instagram", "twitter", "spotify"];
    const answers = [];
    const handlesPromise = socials.map(async (social) => {
      const query = `What is ${social} handle for ${handle}?`;
      const response = await tvly.search(query, {
        includeDomains: [`${social === "twitter" ? "x" : social}.com`],
        searchDepth: "advanced",
        maxResults: 10,
        includeAnswer: true,
        maxTokens: 1111,
      });
      answers.push(`${social.toUpperCase()}: ${response.answer}`);
    });

    await Promise.all(handlesPromise);

    const content = await getChatCompletions(
      [
        {
          role: "user",
          content: `
        Context: ${JSON.stringify(answers)}
        Instruction: 
          Let me know the tiktok, instagram, twitter, spotify handles in the given context.
          If the handle cannot be extracted, return an empty string.`,
        },
        {
          role: "system",
          content: `Response should be in JSON format. {"data": {"twitter": string, "instagram": string, "spotify": string, "tiktok": string}}.`,
        },
      ],
      1111,
    );

    if (content)
      return res.status(200).json({
        data:
          JSON.parse(
            content
              ?.replaceAll("\n", "")
              ?.replaceAll("json", "")
              ?.replaceAll("```", ""),
          )?.data || [],
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

import { ICONS } from "./consts.js";
import { instructions } from "./instructions.js";

const getSegmentsWithIcons = async (context) => {
  try {
    const content = await getChatCompletions([
      {
        role: "user",
        content: `**Icon Names**: ${JSON.stringify(ICONS)}\n
            **Segment Names**: ${JSON.stringify(context)}`,
      },
      {
        role: "system",
        content: `${instructions.get_segments_icons} \n Response should be in JSON format. {"data": {"segment_name1": "icon_name1", "segment_name2": "icon_name2", ...}}`,
      },
    ]);

    if (content)
      return (
        JSON.parse(
          content
            ?.replaceAll("\n", "")
            ?.replaceAll("json", "")
            ?.replaceAll("```", ""),
        )?.data || []
      );

    throw new Error("No content received from OpenAI");
  } catch (error) {
    console.error(error);
    throw new Error("API request failed");
  }
};
export default getSegmentsWithIcons;

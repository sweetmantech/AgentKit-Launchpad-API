import OpenAI from "openai";
import { instructions } from "../lib/instructions.js";
import {
  AI_MODEL,
  FULL_REPORT_NOTE,
  HTML_RESPONSE_FORMAT_INSTRUCTIONS,
  ICONS,
  REPORT_NEXT_STEP_NOTE,
} from "../lib/consts.js";

export const get_full_report = async (req, res) => {
  try {
    const data = req.body;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1555,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `
          Context: ${JSON.stringify(data)}
          Question: Please, create a tiktok fan segment report.`,
        },
        {
          role: "system",
          content: `${instructions.get_segements_report}
          ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
          NOTE: ${FULL_REPORT_NOTE}`,
        },
      ],
      store: true,
    });

    const content = response.choices[0].message?.content?.toString();
    if (content) return res.status(200).json({ content });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_next_steps = async (req, res) => {
  try {
    const body = req.body;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1111,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Context: ${JSON.stringify(body)}`,
        },
        {
          role: "system",
          content: `${instructions.get_segments_report_next_step}
            ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
            NOTE: ${REPORT_NEXT_STEP_NOTE}`,
        },
      ],
    });

    const answer = response.choices[0].message?.content?.toString();
    if (answer) res.status(200).json({ data: answer });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_segments = async (req, res) => {
  try {
    const body = req.body;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1111,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Context: ${JSON.stringify(body)}`,
        },
        {
          role: "system",
          content: `${instructions.get_fan_segments} \n Response should be in JSON format. {"data": [{ "string": number }, { "string": number }]}.`,
        },
      ],
    });

    const answer = response.choices[0].message?.content?.toString();
    if (answer)
      res.status(200).json({
        data:
          JSON.parse(
            answer
              ?.replaceAll("\n", "")
              ?.replaceAll("json", "")
              ?.replaceAll("```", ""),
          )?.data || [],
      });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_segments_icons = async (req, res) => {
  try {
    const body = req.body;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1111,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `**Icon Names**: ${JSON.stringify(ICONS)}\n
          **Segment Names**: ${JSON.stringify(body)}`,
        },
        {
          role: "system",
          content: `${instructions.get_segments_icons} \n Response should be in JSON format. {"data": {"segment_name1": "icon_name1", "segment_name2": "icon_name2", ...}}`,
        },
      ],
    });

    const answer = response.choices[0].message?.content?.toString();
    if (answer)
      res.status(200).json({
        data:
          JSON.parse(
            answer
              ?.replaceAll("\n", "")
              ?.replaceAll("json", "")
              ?.replaceAll("```", ""),
          )?.data || [],
      });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

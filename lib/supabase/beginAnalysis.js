import { STEP_OF_ANALYSIS } from "../step.js";
import supabase from "./serverClient.js";

const beginAnalysis = async (chat_id) => {
  const { data } = await supabase
    .from("funnel_analytics")
    .insert({
      chat_id,
      status: STEP_OF_ANALYSIS.INITITAL,
    })
    .select("*")
    .single();

  return data;
};

export default beginAnalysis;

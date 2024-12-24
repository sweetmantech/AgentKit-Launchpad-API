import { STEP_OF_ANALYSIS } from "../step.js";
import supabase from "./serverClient.js";

const completeAnalysis = async (analysis_id) => {
  const { data } = await supabase
    .from("funnel_analytics")
    .select("*")
    .eq("id", analysis_id)
    .single();

  const { data: newAnalysis } = await supabase
    .from("funnel_analytics")
    .update({
      ...data,
      status: STEP_OF_ANALYSIS.FINISHED,
    })
    .eq("id", analysis_id)
    .select("*")
    .single();
  return newAnalysis;
};

export default completeAnalysis;

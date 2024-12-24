import { STEP_OF_ANALYSIS } from "../step.js";
import supabase from "./serverClient.js";

const completeAnalysis = async (analysis_id) => {
  const { data } = await supabase
    .from("funnel_analytics")
    .select("*")
    .eq("id", analysis_id)
    .single();

  console.log("ZIAD COMPLETE", data);
  const { data: newAnalysis } = await supabase
    .from("funnle_analytics")
    .update({
      ...data,
      status: STEP_OF_ANALYSIS.FINISHED,
    })
    .select("*")
    .single();
  console.log("ZIAD", newAnalysis)
  return newAnalysis;
};

export default completeAnalysis;

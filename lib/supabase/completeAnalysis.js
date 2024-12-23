import { STEP_OF_ANALYSIS } from "../step";
import supabase from "./serverClient";

const completeAnalysis = async (analysis_id) => {
  const { data } = await supabase
    .from("funnel_analytics")
    .eq("id", analysis_id)
    .select("*")
    .single();

  console.log("ZIAD COMPLETE ANALYSIS");
  const { data: newAnalysis } = await supabase
    .from("funnle_analytics")
    .update({
      ...data,
      status: STEP_OF_ANALYSIS.FINISHED,
    })
    .select("*")
    .single();
  return newAnalysis;
};

export default completeAnalysis;

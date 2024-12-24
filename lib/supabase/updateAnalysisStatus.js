import supabase from "./serverClient.js";

const updateAnalysisStatus = async (
  chat_id,
  analysis_id,
  status,
  progress = 0,
) => {
  const { data } = await supabase
    .from("funnel_analytics")
    .select("*")
    .eq("id", analysis_id)
    .single();

  const { data: newAnalysis } = await supabase
    .from("funnel_analytics")
    .update({
      ...data,
      status,
    })
    .eq("id", analysis_id)
    .select("*")
    .single();

  global.io.emit(`${chat_id}`, { status, progress });
  return newAnalysis;
};

export default updateAnalysisStatus;

import supabase from "./serverClient.js";

const saveFunnelAnalysis = async (analysis) => {
  const { data } = await supabase
    .from("tiktok_analysis")
    .insert({
      ...analysis,
    })
    .select("*")
    .single();

  return data;
};

export default saveFunnelAnalysis;

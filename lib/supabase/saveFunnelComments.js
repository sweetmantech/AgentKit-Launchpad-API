import supabase from "./serverClient.js";

const saveFunnelComments = async (comments) => {
  const { data } = await supabase
    .from("funnel_analytics_comments")
    .insert(comments)
    .select("*");

  return data;
};

export default saveFunnelComments;

import supabase from "./serverClient";

const saveFunnelComments = async (comments) => {
  const { data } = await supabase
    .from("funnel_analytics_comments")
    .insert(comments)
    .select("*");

  console.log("ZIAD COMMENTS", data);
  return data;
};

export default saveFunnelComments;

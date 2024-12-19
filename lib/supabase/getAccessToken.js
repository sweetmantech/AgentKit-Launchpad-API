import getAccessTokenByRefreshToken from "./getAccessTokenByRefreshToken.js";
import getAdminPresave from "./getAdminPresave.js";
import supabase from "./serverClient.js";

const getAccessToken = async () => {
  try {
    const presave = await getAdminPresave();
    if (presave?.error) return { error };
    const refreshToken = presave.refreshToken;
    const tokens = await getAccessTokenByRefreshToken(refreshToken);
    if (tokens?.error) return { error };
    const { data, error } = await supabase
      .from("presave")
      .from("presave")
      .update({
        ...data,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken,
      })
      .eq("id", "admin")
      .select("*")
      .single();
    if (error) return { error };
    return tokens.accessToken;
  } catch (error) {
    return { error };
  }
};

export default getAccessToken;

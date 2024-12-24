import supabase from "./serverClient.js";

const updateArtistProfile = async (
  accountId,
  image,
  name,
  instruction,
  label,
  knowledges,
) => {
  const { data: artistInfo } = await supabase
    .from("artists")
    .insert({
      image,
      name,
      instruction,
      knowledges,
      label,
      timestamp: Date.now(),
    })
    .select("*")
    .single();

  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", accountId);
  if (!account || !account.length) throw Error("Account does not exist.");

  await supabase
    .from("accounts")
    .update({
      ...account[0],
      artistIds: [...account[0].artistIds, artistInfo.id],
    })
    .eq("id", account[0].id);
  return artistInfo.id;
};

export default updateArtistProfile;

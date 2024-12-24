const getFormattedAccount = (data) => {
  const videoUrls = [];
  const aggregatedData = data.reduce((acc, item) => {
    const existingAuthor = acc.find(
      (author) => author.name === item.authorMeta.name,
    );

    if (existingAuthor) {
      videos.push(item.webVideoUrl);
    } else {
      acc.push({
        name: item.authorMeta.name,
        nickname: item.authorMeta.nickName,
        region: item.authorMeta.region,
        avatar: item.authorMeta.avatar,
        bio: item.authorMeta.signature,
        videos: [item.webVideoUrl],
        fans: item.authorMeta.fans,
        following: item.authorMeta.following,
      });
    }
    return acc;
  }, []);

  return {
    profile: Object.values(aggregatedData),
    videoUrls,
  };
};

export default getFormattedAccount;

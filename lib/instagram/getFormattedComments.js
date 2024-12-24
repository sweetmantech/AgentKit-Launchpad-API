const getFormattedComments = (data, analysis_id) => {
  const sorteddata = data.sort(
    (a, b) => b?.createTime || 0 - a?.createTime || 0,
  );

  const comments = sorteddata.map((comment) => {
    const { postUrl, text, timestamp, ownerUsername } = comment;
    return {
      comment: text,
      username: ownerUsername,
      post_url: postUrl,
      type: "INSTAGRAM",
      analysis_id,
      timestamp: new Date(timestamp).getTime(),
    };
  });

  return comments;
};

export default getFormattedComments;

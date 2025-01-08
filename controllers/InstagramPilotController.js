import getInstagramAnalysis from "../agents/getInstagramAnalysis.js";

export const run_instagram_agent = async (req, res) => {
  try {
    const { handle } = req.query;
    const pilotId = uuidV4();
    res.status(200).json({ pilotId });
    getInstagramAnalysis(handle, pilotId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

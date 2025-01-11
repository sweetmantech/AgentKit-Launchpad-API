import initializeAgent from "../lib/AgentKit/initializeAgent.js";
import runAutonomousMode from "../lib/AgentKit/runAutonomousMode.js";

export const run = async (req, res) => {
  try {
    console.log("STARTING AGENTKIT LAUNCHPAD AGENT");
    const { agent, config } = await initializeAgent();
    await runAutonomousMode(agent, config);
    res.json({
      status: "success",
      message: "Agent completed execution (33s timeout reached)",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

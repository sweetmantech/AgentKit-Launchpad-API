import initializeAgent from "../lib/AgentKit/initializeAgent.js";
import runAutonomousMode from "../lib/AgentKit/runAutonomousMode.js";

export const run = async (req, res) => {
  try {
    console.log("STARTING AGENTKIT LAUNCHPAD AGENT");
    const { agent, config } = await initializeAgent();
    await runAutonomousMode(agent, config);
    res.json({
      status: "success",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
};

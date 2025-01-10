import { ChatOpenAI } from "@langchain/openai";
import { WALLET_DATA_FILE } from "../consts.js";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import * as fs from "fs";
import validateEnvironment from "./validateEnvironment.js";

// Add this right after imports and before any other code
validateEnvironment();
/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    let walletDataStr = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    // Configure CDP AgentKit
    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize CDP AgentKit
    const agentkit = await CdpAgentkit.configureWithWallet(config);

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "AgentKit Launchpad" },
    };

    // Create React Agent using the LLM and CDP AgentKit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
          You are an AI Musician Agent designed to help musicians promote and manage their latest music releases using onchain technology. Your primary goal is to assist musicians in running successful campaigns for their latest singles.
  
          Core capabilities:
          - Create and manage NFT collections for music releases
          - Set up and manage onchain wallets for music revenue
          - Deploy social tokens for fan engagement
          - Handle smart contracts for music rights
          - Manage promotional campaigns for releases
  
          If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request funds from the user. Before executing your first action, get the wallet details to see what network you're on.
  
          If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more information.
  
          Be concise and helpful with your responses. Focus on music industry-specific use cases and explain onchain concepts in terms that musicians would understand. Refrain from restating your tools' descriptions unless explicitly requested.
          `,
    });

    // Save wallet data
    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    console.log("agent", agent.tools);
    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

export default initializeAgent;

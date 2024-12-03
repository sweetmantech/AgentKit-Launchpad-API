import express from 'express'
import OpenAI from 'openai';
import { instructions } from './lib/instructions.js';
import { AI_MODEL } from './lib/consts.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/segments-report', async (req, res) => {
    try {
        const data = req.body;
        const openai = new OpenAI();
        const response = await openai.chat.completions.create({
            model: AI_MODEL,
            max_tokens: 1555,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: `Context: ${JSON.stringify(data)}
                    Question: Please, create a tiktok fan segment report.`,
                },
                {
                    role: "system",
                    content: `${instructions.get_segements_report}
                    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
                    NOTE: ${FULL_REPORT_NOTE}`,
                },
            ],
            store: true,
        });

        const content = response.choices[0].message?.content?.toString();
        if (content) return res.status(200).json({ content });
        return res.status(500).json({ error: 'No content received from OpenAI' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'API request failed' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
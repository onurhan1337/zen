export const sendTaskCreateSlackMessage = async (messagePayload: any) => {
    const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
        console.error("SLACK_WEBHOOK_URL is not set");
        throw new Error("SLACK_WEBHOOK_URL is not set");
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
        });

        if (!response.ok) {
            const responseBody = await response.text();
            console.error(`Error sending Slack message: ${response.status} ${response.statusText}`, responseBody);
            throw new Error(`Slack API responded with ${response.status}: ${responseBody}`);
        }

        return true;
    } catch (error: any) {
        console.error("Error sending Slack message:", error.message);
        throw new Error("Error sending Slack message: " + error.message);
    }
};

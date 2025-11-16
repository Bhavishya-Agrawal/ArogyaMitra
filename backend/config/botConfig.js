import { BotFrameworkAdapter } from 'botbuilder';

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
export const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log.
  console.error(`\n [onTurnError] unhandled error: ${error}`);
  console.error("ERROR STACK:", error.stack);

  // Send a trace activity
  await context.traceActivity('OnTurnError', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
};
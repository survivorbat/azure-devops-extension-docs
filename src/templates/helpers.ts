import Handlebars from 'handlebars';
import os from 'os';

// Helper to show the options as a list
Handlebars.registerHelper(
  'inputType',
  (inputType: string, options: Record<string, string>): string => {
    if (inputType !== 'radio') {
      return inputType;
    }

    return Object.keys(options).join(', ');
  },
);

// Helper to strip newlines
Handlebars.registerHelper('strip-newlines', (input: string): string =>
  (input || '').split(os.EOL).join(' '),
);

// Helper to capitalize the first letter
Handlebars.registerHelper('capitalize', (input: string): string => {
  if (input.length == 0) {
    return '';
  }

  const capital = input.charAt(0).toUpperCase();
  return capital + input.substring(1);
});

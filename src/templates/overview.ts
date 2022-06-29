import { ExtensionData } from '../core/objects';
import { EOL } from 'os';

// TODO: Add more information

export const overviewTemplate = ({ extension, tasks }: ExtensionData) => {
  let taskParagraph: string = '';
  if (tasks.length > 0) {
    taskParagraph = `${EOL}${EOL}`;

    tasks.forEach(({ friendlyName, description }) => {
      taskParagraph += `### ${friendlyName}${EOL}` + `${EOL}` + `${description}${EOL}` + `${EOL}`;
    });
  }

  // Return markdown contents
  return (
    `# ${extension.name}${EOL}` +
    `${EOL}` +
    `${extension.description}${taskParagraph}${EOL}`
  );
};

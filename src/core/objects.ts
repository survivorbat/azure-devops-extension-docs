interface Task {
  $schema: string;
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  helpMarkDown: string;
  author: string;
  version: {
    Major: number;
    Minor: number;
    Patch: number;
  };
  preview: false;
  showEnvironmentVariables: false;
  runsOn: string[];
  category: string;
  visibility: string[];
  inputs: [
    {
      name: string;
      type: string;
      label: string;
      required: true;
      defaultValue: string;
      helpMarkDown: string;
    },
  ];
  execution: {
    Node10: {
      target: string;
    };
  };
}

interface Extension {
  manifestVersion: number;
  id: string;
  publisher: string;
  version: string;
  name: string;
  description: string;
  public: boolean;
  categories: string[];
  galleryFlags: string[];
  targets: [
    {
      id: string;
    },
  ];
  icons: {
    default: string;
  };
  content: {
    details: {
      path: string;
    };
  };
  tags: string[];
  links: {
    home: {
      uri: string;
    };
    support: {
      uri: string;
    };
    repository: {
      uri: string;
    };
    issues: {
      uri: string;
    };
  };
  branding: {
    color: string;
    theme: string;
  };
  contributions: [
    {
      id: string;
      type: string;
      targets: string[];
      properties: {
        name: string;
      };
    },
  ];
  files: [
    {
      path: string;
      addressable: true;
    },
  ];
  scopes: string[];
}

export interface ExtensionData {
  extension: Extension;
  tasks: Task[];
}

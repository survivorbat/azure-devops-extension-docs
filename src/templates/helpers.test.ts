import Handlebars from 'handlebars';
import './helpers';
import os from 'os';

describe('inputType', () => {
  const testData = [
    {
      input: { inputType: 'radio', options: { a: 'a', b: 'b', c: 'c' } },
      expected: 'a, b, c',
    },
    {
      input: { inputType: 'string', options: { e: 'e', f: 'f', g: 'g' } },
      expected: 'string',
    },
  ];

  testData.forEach(({ expected, input }) => {
    it(`returns ${expected} on ${input.inputType}`, () => {
      // Act
      const result = Handlebars.compile('{{ inputType inputType options }}')(
        input,
      );

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('strip-newlines', () => {
  const testData = [
    {
      input: `I${os.EOL}am${os.EOL}so${os.EOL}happy`,
      expected: 'I am so happy',
    },
    {
      input: 'I am so sad',
      expected: 'I am so sad',
    },
  ];

  testData.forEach(({ expected, input }) => {
    it(`returns ${expected} on ${input}`, () => {
      // Act
      const result = Handlebars.compile('{{ strip-newlines input }}')({
        input,
      });

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('capitalize', () => {
  const testData = [
    {
      input: 'hello',
      expected: 'Hello',
    },
    {
      input: 'Hello',
      expected: 'Hello',
    },
  ];

  testData.forEach(({ expected, input }) => {
    it(`returns ${expected} on ${input}`, () => {
      // Act
      const result = Handlebars.compile('{{ capitalize input }}')({ input });

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

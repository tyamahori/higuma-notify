import { XMLParser } from 'fast-xml-parser';

export const XmlParser = (body: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  return parser.parse(body);
};

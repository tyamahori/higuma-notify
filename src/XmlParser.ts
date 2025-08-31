import { XMLParser } from 'fast-xml-parser';

export const XmlParser = (body: string) => {
  const parser: XMLParser = new XMLParser({
    ignoreAttributes: false,
  });

  return parser.parse(body);
};

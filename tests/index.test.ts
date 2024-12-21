import { OrgParser, OrgDocument, OrgHeading } from '../src/index';

describe('OrgParser', () => {
  it('should parse org content into an OrgDocument with OrgHeadings', () => {
    const orgContent = `
* Saturday opening remarks  :emacsconf:emacsconf2024:
:PROPERTIES:
:DATE: 2024-12-07
:MEDIA_URL: https://media.emacsconf.org/2024/emacsconf-2024-sat-open--saturday-opening-remarks--main.webm
:YOUTUBE_URL: https://youtu.be/YrlAfWfgvIQ
:SPEAKERS:
:END:
* Writing academic papers in Org-Roam  :emacsconf:emacsconf2024:
:PROPERTIES:
:DATE: 2024-12-07
:MEDIA_URL: https://media.emacsconf.org/2024/emacsconf-2024-papers--writing-academic-papers-in-orgroam--vincent-conus--main.webm
:SPEAKERS: Vincent Conus
:END:`;

    const document = OrgParser.parse(orgContent);

    const expectedDocument = new OrgDocument([
      new OrgHeading(
        'Saturday opening remarks',
        ['emacsconf', 'emacsconf2024'],
        {
          DATE: '2024-12-07',
          MEDIA_URL: 'https://media.emacsconf.org/2024/emacsconf-2024-sat-open--saturday-opening-remarks--main.webm',
          YOUTUBE_URL: 'https://youtu.be/YrlAfWfgvIQ',
          SPEAKERS: ''
        },
      ),
      new OrgHeading(
        'Writing academic papers in Org-Roam',
        ['emacsconf', 'emacsconf2024'],
        {
          DATE: '2024-12-07',
          MEDIA_URL: 'https://media.emacsconf.org/2024/emacsconf-2024-papers--writing-academic-papers-in-orgroam--vincent-conus--main.webm',
          SPEAKERS: 'Vincent Conus'
        },
      )
    ]);

    expect(document).toEqual(expectedDocument);
  });
});
import IAnalysisService from "../IAnalysisService";
import { injectable } from "inversify";

@injectable()
export default class AnalysisService implements IAnalysisService {

    printInfo = async () => {
        await Word.run(async (context) => {

            let body = context.document.body;
            body.load("ooxml");
            await context.sync();

            let ooxmlContent = body.getOoxml();
            await context.sync();

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(ooxmlContent.value, "application/xml");

            body.insertParagraph(await this.count(xmlDoc) + '', Word.InsertLocation.end);

            await context.sync();

        }).catch((error) => {
            console.error(error);
        });
    }

    count = async (doc: Document) => {
        let count = 0;

        let pPrNodes = Array.from(doc.getElementsByTagName('w:pPr'));
        let rNodes = Array.from(doc.getElementsByTagName('w:r'));

        let nodes = pPrNodes.concat(rNodes);

        for (let i = 0; i < nodes.length; i++) {
            const tElement = nodes[i].getElementsByTagName('w:t')[0];

            const rPr = nodes[i].getElementsByTagName('w:rPr')[0];
            if (rPr) {
                const rStyle = rPr.getElementsByTagName('w:rStyle')[0];

                if (rStyle && rStyle.getAttribute('w:val') === 'raketijsje2'
                    && tElement) {
                    count++;
                }
            }
        }

        return count;
    }

    downloadXML = async () => {
        await Word.run(async (context) => {
            let body = context.document.body;
            body.load("ooxml");
            await context.sync();

            let ooxmlContent = body.getOoxml();
            await context.sync();

            let serializer = new XMLSerializer();
            let xmlStr = serializer.serializeToString(document);

            await this.download('word.xml', xmlStr);
        });
    }

    download = async (filename: string, text: string) => {
        const pom = document.createElement('a');
        pom.setAttribute(
            'href',
            `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            const event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
}

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = process.env.PDF_PARSER_WORKER;
const parsePDF = async (file) => {
  try {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result);
        const pdf = await getDocument({ data: typedArray }).promise;

        let textContent = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const textItems = content.items.map((item) => item.str);
          textContent += textItems.join(" ");
        }

        resolve(textContent); // Return parsed PDF content
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Error parsing PDF");
  }
};

export { parsePDF };

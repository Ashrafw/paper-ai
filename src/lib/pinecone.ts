// import { Pinecone, PineconeClient } from "@pinecone-database/pinecone";

// let pinecone = null;

// // const pinecone = new Pinecone({
// //     apiKey: 'your_api_key',
// //     environment: 'your_environment',
// //   });

// export const getPineconeClint = async()=>{
//     if(!pinecone){

//     }
// }
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";

import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embedding";
import { convertToAscii } from "./utils";
export const getPineConeClient = async () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  return pinecone;
};

type pDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
export async function loadS3IntoPinecone(fileKey: string) {
  // get the pdf-> download and read from the pdf
  console.log("download from s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as pDFPage[];

  //   2. split and segment the pdf
  //   return pages;
  const documents = await Promise.all(pages.map(prepareDoc));

  //   3. vectorise and embed into individual documents

  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineConeClient();
  const pineconeIndex = await client.index("paper-ai");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document: ", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDoc(page: pDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, " ");
  //   split docs
  const splitter = new RecursiveCharacterTextSplitter();
  const doc = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return doc;
}

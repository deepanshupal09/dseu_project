"use client";

import { CircularProgress } from "@mui/material";
import {
  BlobProvider,
} from "@react-pdf/renderer";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

//I added this imports to add suport to textLayer and anotations
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

//this due a Worker not found error
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type Props = {
  document: any;
  filename?: string;
  isLoading?: boolean;
  className?: React.CSSProperties | string;
};

const LoadingScreen = () => (
  <div className="pt-10">
    <CircularProgress  />
  </div>
);

const PdfExport = (props: Props) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div id="pdf" ref={parentRef} className={props.className + ""}>
      <BlobProvider document={props.document}>
        {({ blob, url, loading, error }) =>
          loading ? (
            <LoadingScreen />
          ) : (
            <Document  file={url} loading={loading ? <LoadingScreen /> : null}>
              <Page
                loading={loading ? <LoadingScreen /> : null}
                // pageNumber={1}
                error={"Error"}
                width={parentRef.current?.clientWidth}
              />
            </Document>
          )
        }
      </BlobProvider>
    </div>
  );
};

export default PdfExport;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

interface PDFViewerProps {
  uid: string | undefined;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ uid }) => {
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await axios.get(
          `https://api.hr-infozilion.pitetris.com/v1/mak/policy/show/file/${uid}`,
          {
            responseType: "blob", // Fetching the file as a Blob
          }
        );

        if (response.status === 200 && response.data) {
          setPdfFile(response.data);
          console.log("PDF file fetched successfully:", response.data);
        } else {
          setError("Failed to load PDF.");
          console.error("Failed to load PDF. Status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Error fetching PDF.");
      }
    };
    getFile();
  }, [uid]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log("PDF loaded successfully with", numPages, "pages.");
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF document:", error);
    setError("Error loading PDF document.");
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};

export default PDFViewer;

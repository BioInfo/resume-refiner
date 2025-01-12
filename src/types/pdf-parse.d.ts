declare module 'pdf-parse' {
  export interface PDFData {
    numpages: number
    numrender: number
    info: {
      PDFFormatVersion: string
      IsAcroFormPresent: boolean
      IsXFAPresent: boolean
      [key: string]: any
    }
    metadata: any
    text: string
    version: string
  }

  export interface PDFOptions {
    pagerender?: (pageData: any) => string
    max?: number
    version?: string
  }

  function PDFParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>
  
  export default PDFParse
}
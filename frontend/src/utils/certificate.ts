import type { Certificate } from "../types";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function imageToDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function registerCustomFont(pdfMake: any, url: string, fontName: string) {
  if (pdfMake.fonts[fontName]) return;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  const vfsKey = `${fontName}.ttf`;
  pdfMake.vfs[vfsKey] = base64;
  pdfMake.fonts[fontName] = { normal: vfsKey, bold: vfsKey, italics: vfsKey, bolditalics: vfsKey };
}

async function initPdfMake(): Promise<any> {
  const pdfMake = (await import("pdfmake/build/pdfmake")).default;
  const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
  pdfMake.vfs = pdfFonts;
  pdfMake.fonts = {
    Roboto: { normal: "Roboto-Regular.ttf", bold: "Roboto-Medium.ttf", italics: "Roboto-Italic.ttf", bolditalics: "Roboto-MediumItalic.ttf" },
  };
  return pdfMake;
}

const STANDARD_FONTS = ["Helvetica", "Times", "Courier"];

const A4_LANDSCAPE_W = 841.89;
const A4_LANDSCAPE_H = 595.28;

async function getPdfGenerator(cert: Certificate, studentName: string) {
  const pdfMake = await initPdfMake();
  const course = cert.course;
  let hasBg = !!course.certificateBgUrl;
  let pageW = A4_LANDSCAPE_W;
  let pageH = A4_LANDSCAPE_H;
  let nameX = Math.round(course.certificateNameX * A4_LANDSCAPE_W / 612);
  let nameY = Math.round(course.certificateNameY * A4_LANDSCAPE_H / 792);
  let nameFont = course.certificateNameFont;

  if (STANDARD_FONTS.includes(nameFont)) {
    nameFont = "Roboto";
  } else if (course.certificateFontUrl) {
    await registerCustomFont(pdfMake, course.certificateFontUrl, nameFont);
  }

  let docDefinition: any;
  const content: any[] = [];

  if (hasBg) {
    let dataUrl: string;
    try {
      const img = await imageToDataUrl(course.certificateBgUrl!);
      dataUrl = img.dataUrl;
      pageW = img.width > 0 ? img.width : A4_LANDSCAPE_W;
      pageH = img.height > 0 ? img.height : A4_LANDSCAPE_H;
    } catch {
      dataUrl = "";
    }
    if (dataUrl) {
      nameX = Math.round(course.certificateNameX * pageW / 612);
      nameY = Math.round(course.certificateNameY * pageH / 792);
      content.push(
        { image: dataUrl, width: pageW, height: pageH, absolutePosition: { x: 0, y: 0 } },
        { text: studentName, fontSize: course.certificateNameSize, font: nameFont, bold: true, color: "#1e3a5f", absolutePosition: { x: nameX, y: nameY } },
        { text: course.certificateTitle || "Certificado de finalización", fontSize: 10, color: "#666", absolutePosition: { x: Math.round(pageW / 2), y: Math.round(760 / 792 * pageH) } },
        { text: `Código: ${cert.code}`, fontSize: 8, color: "#aaa", font: "Roboto", absolutePosition: { x: Math.round(pageW / 2), y: Math.round(775 / 792 * pageH) } },
      );
      docDefinition = {
        pageSize: { width: pageW, height: pageH },
        pageMargins: [0, 0, 0, 0],
        content,
        defaultStyle: { font: "Roboto" },
      };
    } else {
      hasBg = false;
    }
  }
  if (!hasBg) {
    content.push(
      { text: "INSTITUTO DE INVESTIGACIÓN INNOVACIÓN", style: "header" },
      { text: "\n\n" },
      { text: "CERTIFICA QUE", style: "subheader" },
      { text: "\n" },
      { text: studentName, fontSize: course.certificateNameSize, font: nameFont, bold: true, alignment: "center", color: "#1e3a5f", margin: [0, 10, 0, 10] },
      { text: "\n" },
      { text: "Ha completado satisfactoriamente el curso", style: "body" },
      { text: "\n" },
      { text: course.title, style: "courseName" },
      { text: "\n\n" },
      { text: `Fecha de emisión: ${new Date(cert.issuedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}`, style: "body" },
      { text: "\n" },
      { text: `Código de verificación: ${cert.code}`, style: "code" },
      { text: "\n\n" },
      { text: "Verificar autenticidad en: instituto.edu/verificar", style: "footer" },
    );
    docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [60, 60, 60, 60],
      content,
      styles: {
        header: { fontSize: 20, bold: true, alignment: "center", color: "#1e3a5f", margin: [0, 20, 0, 0] },
        subheader: { fontSize: 12, alignment: "center", color: "#666", italics: true },
        body: { fontSize: 13, alignment: "center", color: "#444" },
        courseName: { fontSize: 18, bold: true, alignment: "center", color: "#0ea5e9", margin: [0, 5, 0, 5] },
        code: { fontSize: 11, alignment: "center", color: "#888", margin: [0, 10, 0, 0], font: "Roboto" },
        footer: { fontSize: 10, alignment: "center", color: "#aaa", margin: [0, 30, 0, 0] },
      },
      defaultStyle: { font: "Roboto" },
    };
  }

  return { pdfMake, docDefinition };
}

export async function downloadCertificatePdf(cert: Certificate, studentName: string) {
  const { pdfMake, docDefinition } = await getPdfGenerator(cert, studentName);
  pdfMake.createPdf(docDefinition).download(`certificado-${cert.code}.pdf`);
}

export async function getCertificateBlobUrl(cert: Certificate, studentName: string): Promise<string> {
  const { pdfMake, docDefinition } = await getPdfGenerator(cert, studentName);
  const blob = await pdfMake.createPdf(docDefinition).getBlob();
  return URL.createObjectURL(blob);
}

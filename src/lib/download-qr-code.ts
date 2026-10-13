export async function downloadQrCodeAsPng(
  qrElement: HTMLElement,
  filename: string,
) {
  const svg = qrElement.querySelector("svg");

  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });

  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("QR Code gagal diproses"));
      image.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    const size = 512;

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!pngBlob) return;

    const pngUrl = URL.createObjectURL(pngBlob);
    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

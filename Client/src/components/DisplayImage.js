import React, { useEffect, useRef } from "react";

function DisplayImage({ imageUrl, watermark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      if (!watermark) return;

      const text = `Privyra: ${watermark}`;
      const fontSize = Math.max(18, img.width / 28);

      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = "center";

      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 4);

      const stepX = fontSize * 8;
      const stepY = fontSize * 4;

      for (let y = -img.height; y < img.height * 2; y += stepY) {
        for (let x = -img.width; x < img.width * 2; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    img.src = imageUrl;
  }, [imageUrl, watermark]);

  return (
    <canvas
      ref={canvasRef}
      className="preview-image"
      style={{
        maxWidth: "100%",
        borderRadius: "12px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

export default DisplayImage;

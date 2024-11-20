import { RcFile } from "antd/lib/upload/interface";

export const getCroppedImg = async (
    imageSrc: string,
    croppedAreaPixels: any
): Promise<RcFile> => {
    const image = new Image();
    image.src = imageSrc;

    // Görüntü yüklendikten sonra işleme başla
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (err) => reject(new Error("Image loading failed"));
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Canvas context mevcut mu kontrol et
    if (!ctx) {
        throw new Error("Canvas context is not available");
    }

    // Canvas boyutlarını ayarla
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Cropping alanı geçerli mi kontrol et
    if (croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
        throw new Error("Invalid cropping area dimensions");
    }

    // Canvas'tan resmi çiz
    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    // Canvas'ı base64 olarak al
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Base64'ü Blob'a dönüştür
    const blob = await fetch(dataUrl).then((res) => res.blob());

    if (!blob) {
        throw new Error("Failed to generate blob from canvas");
    }

    // Blob'u RcFile olarak dönüştür
    const fileName = "cropped-image.jpeg"; // Varsayılan dosya adı
    const rcFile = new File([blob], fileName, { type: "image/jpeg" }) as RcFile;

    // RcFile için uid ekle (antd upload bileşeni için gerekebilir)
    rcFile.uid = `${Date.now()}`; // Benzersiz bir UID oluştur

    return rcFile;
};

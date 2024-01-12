import Jimp from "jimp";

export async function resizeImage (imageBuffer, width, height) {
  const image = await Jimp.read(imageBuffer);

  image.resize(width, height);

  return await image.getBufferAsync("image/png");
}

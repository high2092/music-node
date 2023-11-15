export async function preload(pathList: string[]) {
  await Promise.all(
    pathList.map(
      (path) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = image.onerror = () => resolve();
          image.src = `/image/guide/${path}.gif`;
        })
    )
  );
}

type MapProps = {
  lat: number;
  lng: number;
};

export function getMapPreview(Props: MapProps) {
  const imagePreviewUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${Props.lng},${Props.lat})/${Props.lng},${Props.lat},14/600x300?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;

  return imagePreviewUrl;
}

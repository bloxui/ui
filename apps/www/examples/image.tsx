import { Image } from "@blox-ui/ui";

const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#14b8a6"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><circle cx="470" cy="120" r="56" fill="#fff" opacity=".85"/><path d="M0 400l180-170 120 110 90-70 250 130z" fill="#0f172a" opacity=".5"/></svg>',
  );

export default function ImageExample() {
  return (
    <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
      <Image src={photo} alt="Mountains at sunset" preview wrapperClassName="aspect-[4/3]" />
      <Image src="/missing.png" alt="A photo that failed to load" wrapperClassName="aspect-[4/3]" />
    </div>
  );
}

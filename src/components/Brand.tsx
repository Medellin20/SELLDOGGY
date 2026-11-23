export const brandName = "PAM LOVER'S HALLWAY";

export function BrandLogo({ className }: { className: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}pam-lovers-hallway.png`}
      alt=""
      width={526}
      height={475}
      className={className}
    />
  );
}

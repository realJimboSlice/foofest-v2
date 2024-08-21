import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-pulse">
        <Image
          src="/assets/images/foofest-banner-nobg.webp"
          alt="FooFest Loading"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Loading;

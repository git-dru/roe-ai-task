import DetectWithFile from "@/components/DetectWithFile";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <div className="flex flex-col items-center justify-between gap-4 min-h-60 bg-zinc-800 w-full max-w-2xl py-10 px-4 rounded-xl h-fit">
    {children}
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-8 py-20 px-4 md:px-32 bg-zinc-900 text-white">
      <div className="flex justify-center gap-8">
        <Container>
          <h1 className="text-2xl font-bold">Please Select File.</h1>
          <DetectWithFile
            acceptedFileTypes={["video/mp4"]}
            label="Max File Length: 3 mins"
            labelAlt="Accepted File Types: MP4"
          />
        </Container>
      </div>
    </main>
  );
}

export default function NetworkPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] relative overflow-hidden bg-[#F8F9FC]">
      <iframe
        src="/index.html"
        title="Network Intelligence Graph"
        className="w-full h-full border-0 absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

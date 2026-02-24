import { Header } from "./components/Header";
import { ImageHandler } from "./components/ImageHandler";

export default async function Login() {
  // Artificial delay to demonstrate loading state (3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="overflow-x-hidden"
    >
      <Header />
      <ImageHandler />
    </div>
  );
}

import NavBar from "../components/navbar"

export default function Home() {
  return (
    <>
    <NavBar />
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">Home page</h1>
    </div>
    </>
  );
}

import Image from "next/image";
import Button from "./buttons";

export default function Home() {
    return (
        <main className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-6xl text-center">Fish!</h1>
            <div className="flex justify-center mt-4">
                <Button />
            </div>
        </main>
    );
}

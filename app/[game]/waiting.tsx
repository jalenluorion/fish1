import { useState } from 'react';
import Link from 'next/link';

export default function Waiting({ deck, code, participants, handleParticipantsChange, startGame }: { deck: { name: string, cards: string[] }[], code: string, participants: number, handleParticipantsChange: (value: number) => void, startGame: () => void}){

    return (
        <main>
            {participants === 0 ? (
                <div>
                    <Link href='/'>Home</Link>
                    <div className="flex justify-center items-center w-screen h-screen">
                        <button
                            onClick={() => handleParticipantsChange(6)}
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2 mr-2`}
                        >
                            6 Participants
                        </button>
                        <button
                            onClick={() => handleParticipantsChange(8)}
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2`}
                        >
                            8 Participants
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <Link href='/'>Home</Link>
                    <div className="flex justify-center items-center flex-col gap-10">
                        <h1 className='text-6xl text-center'>Game Code: {code}</h1>
                        <h2 className='text-4xl text-center'>Participants: {deck.length}/{participants}</h2>
                        <div>
                            {deck.map((player, index) => (
                                <div key={index} className="flex justify-center items-center py-1 px-2">
                                    <p>{player.name}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={startGame}
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2`}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { HHand, VHand } from './card';
import { Score } from './score';
import Script from 'next/script';
import Link from 'next/link';

export default function Game({ id, deck, halfSet1, halfSet2, handleCardTransfer, handleDeclare }: { id: string; deck: { name: string; id: string; cards: string[] }[]; halfSet1: string[]; halfSet2: string[]; handleCardTransfer: (value: string, destinationName: string) => void; handleDeclare: (value: string, halfSet: number, correct: boolean) => void}) {
    const fullDeck6 = ['AS', 'AH', 'AD', 'AC', '2S', '2H', '2D', '2C', '3S', '3H', '3D', '3C', '4S', '4H', '4D', '4C', '5S', '5H', '5D', '5C', '6S', '6H', '6D', '6C', '7S', '7H', '7D', '7C', '8S', '8H', '8D', '8C', '9S', '9H', '9D', '9C', 'TS', 'TH', 'TD', 'TC', 'JS', 'JH', 'JD', 'JC', 'QS', 'QH', 'QD', 'QC', 'KS', 'KH', 'KD', 'KC', 'JB', 'JR'];
    const fulldeck8 = ['2S', '2H', '2D', '2C', '3S', '3H', '3D', '3C', '4S', '4H', '4D', '4C', '5S', '5H', '5D', '5C', '6S', '6H', '6D', '6C', '7S', '7H', '7D', '7C', '8S', '8H', '8D', '8C', '9S', '9H', '9D', '9C', 'TS', 'TH', 'TD', 'TC', 'JS', 'JH', 'JD', 'JC', 'QS', 'QH', 'QD', 'QC', 'KS', 'KH', 'KD', 'KC'];

    const [gameOver, setGameOver] = useState(false);

    const index = deck.findIndex((player) => player.id === id);

    return (
        <main className='flex flex-col h-screen'>
            <link
                rel='stylesheet'
                type='text/css'
                href='https://unpkg.com/cardsJS/dist/cards.min.css'
            />
            <Script src='https://unpkg.com/cardsJS/dist/cards.min.js'></Script>
            {deck.length === 6 ? (
            <div className='flex flex-1 flex-col bg-[#35654d]'>
                <div className='flex w-full'>
                    <div className='flex-1'>
                        <HHand
                            index={(index + 4)% deck.length}
                            deck={deck}
                            active={deck[(index + 4)% deck.length].id === id}
                            orientation='bottom'
                            func={handleCardTransfer}
                        />
                    </div>
                    <div className='flex-1'>
                        <HHand
                            index={(index + 3)% deck.length}
                            deck={deck}
                            active={deck[(index + 3)% deck.length].id === id}
                            orientation='bottom'
                            func={handleCardTransfer}
                        />
                    </div>
                </div>
                <div className='flex w-full flex-1'>
                    <div className='flex'>
                        <VHand
                            index={(index + 5)% deck.length}
                            deck={deck}
                            active={deck[(index + 5)% deck.length].id === id}
                            orientation='right'
                            func={handleCardTransfer}
                        />
                    </div>
                    <Score
                        halfSet1={halfSet1}
                        halfSet2={halfSet2}
                        handleDeclare={handleDeclare}
                        id={id}
                        deck={deck}
                    />
                    <div className='flex ml-3'>
                        <VHand
                            index={(index + 2)% deck.length}
                            deck={deck}
                            active={deck[(index + 2)% deck.length].id === id}
                            orientation='left'
                            func={handleCardTransfer}
                        />
                    </div>
                </div>
                <div className='flex w-full'>
                    <div className='flex-1'>
                        <HHand
                            index={index}
                            deck={deck}
                            active={deck[index].id === id}
                            orientation='top'
                            func={handleCardTransfer}
                        />
                    </div>
                    <div className='flex-1'>
                        <HHand
                            index={(index + 1)% deck.length}
                            deck={deck}
                            active={deck[(index + 1)% deck.length].id === id}
                            orientation='top'
                            func={handleCardTransfer}
                        />
                    </div>
                </div>
            </div>
            ) : (
            <div className='flex-1 flex bg-[#35654d]'>
                <div className='flex flex-col'>
                    <VHand
                        index={(index + 6)% deck.length}
                        deck={deck}
                        active={deck[(index + 6)% deck.length].id === id}
                        orientation='right'
                        func={handleCardTransfer}
                    />
                    <VHand
                        index={(index + 7)% deck.length}
                        deck={deck}
                        active={deck[(index + 7)% deck.length].id === id}
                        orientation='right'
                        func={handleCardTransfer}
                    />
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex'>
                        <div className='flex-1'>
                            <HHand
                                index={(index + 5)% deck.length}
                                deck={deck}
                                active={deck[(index + 5)% deck.length].id === id}
                                orientation='bottom'
                                func={handleCardTransfer}
                            />
                        </div>
                        <div className='flex-1'>
                            <HHand
                                index={(index + 4)% deck.length}
                                deck={deck}
                                active={deck[(index + 4)% deck.length].id === id}
                                orientation='bottom'
                                func={handleCardTransfer}
                            />
                        </div>
                    </div>
                    <Score
                        halfSet1={halfSet1}
                        halfSet2={halfSet2}
                        handleDeclare={handleDeclare}
                        id={id}
                        deck={deck}
                    />
                    <div className='flex'>
                        <div className='flex-1'>
                            <HHand
                                index={index}
                                deck={deck}
                                active={deck[index].id === id}
                                orientation='top'
                                func={handleCardTransfer}
                            />
                        </div>
                        <div className='flex-1'>
                            <HHand
                                index={(index + 1)% deck.length}
                                deck={deck}
                                active={deck[(index + 1)% deck.length].id === id}
                                orientation='top'
                                func={handleCardTransfer}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col ml-3'>
                    <VHand
                        index={(index + 3)% deck.length}
                        deck={deck}
                        active={deck[(index + 3)% deck.length].id === id}
                        orientation='left'
                        func={handleCardTransfer}
                    />
                    <VHand
                        index={(index + 2)% deck.length}
                        deck={deck}
                        active={deck[(index + 2)% deck.length].id === id}
                        orientation='left'
                        func={handleCardTransfer}
                    />
                </div>
            </div>
            )}
        </main>
    );
}

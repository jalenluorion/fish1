'use client';

import { autoUpdate, useFloating } from "@floating-ui/react";
import { useEffect, useState } from "react";
import { Fan } from "./card";

export function Score({halfSet1, halfSet2, handleDeclare, id, deck}: {halfSet1: string[]; halfSet2: string[]; handleDeclare: (value: string, halfSet: number, correct: boolean) => void; id: string; deck: { name: string, id: string, cards: string[] }[]}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeclaring, setIsDeclaring] = useState(false);
    const [declareSelection, setDeclareSelection] = useState(0);
    const [currentSelection, setCurrentSelection] = useState(0);

    const names = deck.map((player) => ({ name: player.name, id: player.id }));

    const halfSets6 = ['High Spades', 'Low Spades', 'High Clubs', 'Low Clubs', 'High Diamonds', 'Low Diamonds', 'High Hearts', 'Low Hearts', 'Aces/Jokers']
    const halfSets8 = ['High Spades', 'Low Spades', 'High Clubs', 'Low Clubs', 'High Diamonds', 'Low Diamonds', 'High Hearts', 'Low Hearts']

    const expandedHalfSets =   [[['8S', '8 of Spades'], ['9S', '9 of Spades'], ['TS', '10 of Spades'], ['JS', 'Jack of Spades'], ['QS', 'Queen of Spades'], ['KS', 'King of Spades']], 
                                 [['2S', '2 of Spades'], ['3S', '3 of Spades'], ['4S', '4 of Spades'], ['5S', '5 of Spades'], ['6S', '6 of Spades'], ['7S', '7 of Spades']], 
                                 [['8C', '8 of Clubs'], ['9C', '9 of Clubs'], ['TC', '10 of Clubs'], ['JC', 'Jack of Clubs'], ['QC', 'Queen of Clubs'], ['KC', 'King of Clubs']], 
                                 [['2C', '2 of Clubs'], ['3C', '3 of Clubs'], ['4C', '4 of Clubs'], ['5C', '5 of Clubs'], ['6C', '6 of Clubs'], ['7C', '7 of Clubs']], 
                                 [['8D', '8 of Diamonds'], ['9D', '9 of Diamonds'], ['TD', '10 of Diamonds'], ['JD', 'Jack of Diamonds'], ['QD', 'Queen of Diamonds'], ['KD', 'King of Diamonds']], 
                                 [['2D', '2 of Diamonds'], ['3D', '3 of Diamonds'], ['4D', '4 of Diamonds'], ['5D', '5 of Diamonds'], ['6D', '6 of Diamonds'], ['7D', '7 of Diamonds']], 
                                 [['8H', '8 of Hearts'], ['9H', '9 of Hearts'], ['TH', '10 of Hearts'], ['JH', 'Jack of Hearts'], ['QH', 'Queen of Hearts'], ['KH', 'King of Hearts']], 
                                 [['2H', '2 of Hearts'], ['3H', '3 of Hearts'], ['4H', '4 of Hearts'], ['5H', '5 of Hearts'], ['6H', '6 of Hearts'], ['7H', '7 of Hearts']], 
                                 [['AS', 'Ace of Spades'], ['AH', 'Ace of Hearts'], ['AD', 'Ace of Diamonds'], ['AC', 'Ace of Clubs'], ['JB', 'Black Joker'], ['JR', 'Red Joker']]]

    var expandedHalfSet1 = []
    var expandedHalfSet2 = []
    for (const halfSet of halfSet1) {
        const index = halfSets6.indexOf(halfSet);

        expandedHalfSet1.push(expandedHalfSets[index].map((selection) => selection[0]));
    }
    expandedHalfSet1 = expandedHalfSet1.flat()

    for (const halfSet of halfSet2) {
        const index = halfSets6.indexOf(halfSet);

        expandedHalfSet2.push(expandedHalfSets[index].map((selection) => selection[0]));
    }
    expandedHalfSet2 = expandedHalfSet2.flat()

    console.log(expandedHalfSet1.flat())
        
    const { refs, floatingStyles } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        placement: "bottom"
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (refs.floating.current && refs.reference.current && !(refs.floating.current as HTMLElement).contains(event.target as Node) && !(refs.reference.current as HTMLElement).contains(event.target as Node)) {
                if (!isDeclaring) {
                    setIsOpen(false);
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function toggle() {
        setIsOpen(!isOpen);
        console.log('toggle');
    }
    function beginDeclaration(index: number) {
        setIsDeclaring(true);
        setDeclareSelection(index);
        setCurrentSelection(0);
    }

    function iterate(playerId: string) {
        const currentTarget = expandedHalfSets[declareSelection][currentSelection][0];
        const currentHalfSet = halfSets6[declareSelection];
        const modulus = deck.findIndex((player) => player.id === id) % 2;

        const currentHalfSetExpanded = expandedHalfSets[declareSelection].map((selection) => selection[0]);

        const player = deck.find((player) => player.id === playerId);
        if (!(player && player.cards.includes(currentTarget))) {
            setIsDeclaring(false);
            setIsOpen(false);
            handleDeclare(currentHalfSet, (modulus + 1) % 2, false);
            alert('Wrong! Half set goes to other team.');
        } else {
            setCurrentSelection(currentSelection + 1);
            if (currentSelection === 5) {
                setIsDeclaring(false);
                setIsOpen(false);
                handleDeclare(currentHalfSet, modulus, true);
                alert('Correct! Half set goes to your team.');
            }
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center">
            <h1 className='text-[#84240c]'>{halfSet1.length} Half-Sets(s)</h1>
            <button
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1'
                ref={refs.setReference}
                onClick={() => toggle()}
            >
                Declare Half-Set
            </button>
            {isOpen && !isDeclaring && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="flex flex-wrap w-1/2 justify-center mt-2"
                >
                    {deck.length === 8 && halfSets8.map((selection, index) => (
                        !halfSet1.includes(selection) && !halfSet2.includes(selection) && (
                            <button
                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1 w-40'
                                key={index}
                                onClick={() => beginDeclaration(index)}
                            >
                                {selection}
                            </button>
                        )
                    ))}
                    {deck.length === 6 && halfSets6.map((selection, index) => (
                        !halfSet1.includes(selection) && !halfSet2.includes(selection) && (
                            <button
                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1 w-40'
                                key={index}
                                onClick={() => beginDeclaration(index)}
                            >
                                {selection}
                            </button>
                        )
                    ))}
                </div>
            )}
            {isDeclaring && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="flex flex-col items-center mt-2"
                >
                    <h1 className='text-white'>Who has the {expandedHalfSets[declareSelection][currentSelection][1]}?</h1>
                    <div>
                    {names
                        .filter((_, key) => key % 2 === deck.findIndex((player) => player.id === id) % 2)
                        .map((player, index) => (
                            <button
                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1'
                                key={index}
                                onClick={() => iterate(player.id)}
                            >
                                {player.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <h1 className='text-[#563232]'>{halfSet2.length} Half-Sets(s)</h1>
        </div>
    );
}

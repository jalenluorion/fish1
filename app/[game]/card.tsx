'use client';

import { useFloating, autoUpdate, shift } from '@floating-ui/react';
import { useState, useEffect } from 'react';

export function Card({ index, active, names, selection, orientation, func }: { index: number; active: boolean; names: { name: string; id: string }[]; selection: string; orientation: string; func: (value: string, name: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        placement: orientation as any,
        middleware: [shift()],
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (refs.floating.current && refs.reference.current && !(refs.floating.current as HTMLElement).contains(event.target as Node) && !(refs.reference.current as HTMLElement).contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function toggle() {
        if (!active) return;
        setIsOpen(!isOpen);
        console.log('toggle');
    }
    function close(selection: string, player: string) {
        if (!active) return;
        setIsOpen(false);
        func(selection, player);
    }

    return (
        <>
            <img
                ref={refs.setReference}
                className={`card ${orientation === 'left' || orientation === 'right' ? '' : 'inline'}`}
                src={`cards/${selection}.svg`}
                alt={selection}
                onClick={() => toggle()}
            />
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                >
                    <div>
                        {names
                            .filter((_, key) => key % 2 === (index + 1) % 2)
                            .map((player, index) => (
                                <button
                                    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1'
                                    key={index}
                                    onClick={() => close(selection, player.id)}
                                >
                                    {player.name}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
}

const expandedHalfSets =   [[['2S', '2 of Spades'], ['3S', '3 of Spades'], ['4S', '4 of Spades'], ['5S', '5 of Spades'], ['6S', '6 of Spades'], ['7S', '7 of Spades']], 
                            [['8S', '8 of Spades'], ['9S', '9 of Spades'], ['TS', '10 of Spades'], ['JS', 'Jack of Spades'], ['QS', 'Queen of Spades'], ['KS', 'King of Spades']], 
                            [['2C', '2 of Clubs'], ['3C', '3 of Clubs'], ['4C', '4 of Clubs'], ['5C', '5 of Clubs'], ['6C', '6 of Clubs'], ['7C', '7 of Clubs']],     
                            [['8C', '8 of Clubs'], ['9C', '9 of Clubs'], ['TC', '10 of Clubs'], ['JC', 'Jack of Clubs'], ['QC', 'Queen of Clubs'], ['KC', 'King of Clubs']], 
                            [['2D', '2 of Diamonds'], ['3D', '3 of Diamonds'], ['4D', '4 of Diamonds'], ['5D', '5 of Diamonds'], ['6D', '6 of Diamonds'], ['7D', '7 of Diamonds']], 
                            [['8D', '8 of Diamonds'], ['9D', '9 of Diamonds'], ['TD', '10 of Diamonds'], ['JD', 'Jack of Diamonds'], ['QD', 'Queen of Diamonds'], ['KD', 'King of Diamonds']], 
                            [['2H', '2 of Hearts'], ['3H', '3 of Hearts'], ['4H', '4 of Hearts'], ['5H', '5 of Hearts'], ['6H', '6 of Hearts'], ['7H', '7 of Hearts']], 
                            [['8H', '8 of Hearts'], ['9H', '9 of Hearts'], ['TH', '10 of Hearts'], ['JH', 'Jack of Hearts'], ['QH', 'Queen of Hearts'], ['KH', 'King of Hearts']], 
                            [['AS', 'Ace of Spades'], ['AH', 'Ace of Hearts'], ['AD', 'Ace of Diamonds'], ['AC', 'Ace of Clubs'], ['JB', 'Black Joker'], ['JR', 'Red Joker']]]
const flatExpanded = expandedHalfSets.flat();

export function HHand({ index, deck, active, orientation, func }: { index: number; deck: { name: string; id: string; cards: string[] }[]; active: boolean; orientation: string; func: (value: string, player: string) => void }) {
    const player = deck[index];
    const names = deck.map(({ name, id }) => ({ name, id }));

    // order the deck in the order of flatExpanded

    const orderedDeck = flatExpanded.map((selection) => {
        const index = player.cards.indexOf(selection[0]);
        if (index === -1) return;
        return player.cards[index];
    }).filter((selection) => selection !== undefined);  

    const color = index % 2 === 0 ? 'bg-[#84240c]' : 'bg-[#563232]';

    return (
        <div
            key={index}
            className='flex flex-col flex-1 items-center'
        >
            {orientation == 'bottom' && <h1 className={`text-4xl mt-1 text-white ${color} p-1 rounded-lg`}>{player.name}</h1>}
            <div className={`hand hhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
                {orderedDeck.map((selection, _) => (
                    <Card
                        key={_}
                        index={index}
                        active={active}
                        names={names}
                        selection={active ? selection || 'Red_Back' : 'Blue_Back'}
                        orientation={orientation}
                        func={func}
                    />
                ))}
            </div>
            {orientation == 'top' && <h1 className={`text-4xl mb-1 text-white ${color} p-1 rounded-lg`}>{player.name}</h1>}
        </div>
    );
}

export function VHand({ index, deck, active, orientation, func }: { index: number; deck: { name: string; id: string; cards: string[] }[]; active: boolean; orientation: string; func: (value: string, player: string) => void }) {
    const player = deck[index];
    const names = deck.map(({ name, id }) => ({ name, id }));

    const color = index % 2 === 0 ? 'bg-[#84240c]' : 'bg-[#563232]';

    return (
        <div
            key={index}
            className='flex flex-1 items-center'
        >
            {orientation == 'right' && (
                <div className='w-10 mr-4 ml-2 flex justify-center'>
                    <div className='w-10 flex justify-center'>
                        <h1 className={`text-4xl transform -rotate-90 text-white ${color} p-1 rounded-lg`}>{player.name}</h1>
                    </div>
                </div>
            )}
            <div className={`hand vhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
                {player.cards.map((selection, _) => (
                    <Card
                        key={_}
                        index={index}
                        active={active}
                        names={names}
                        selection={active ? selection : 'Blue_Back'}
                        orientation={orientation}
                        func={func}
                    />
                ))}
            </div>
            {orientation == 'left' && (
                <div className='w-10 flex justify-center ml-1 mr-2'>
                    <h1 className={`text-4xl transform origin-center rotate-90 text-white ${color} p-1 rounded-lg`}>{player.name}</h1>
                </div>
            )}
        </div>
    );
}

export function Fan({ halfSet }: { halfSet: string[] }) {
    return (
        <div className='hand hhand-compact'>
            {halfSet.map((selection, index) => (
                <img
                    key={index}
                    className='card'
                    src={`cards/${selection}.svg`}
                    alt={selection}
                />
            ))}
        </div>
    );
}
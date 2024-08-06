'use client';

import {useFloating, autoUpdate} from '@floating-ui/react';
import {useState, useEffect} from 'react';

export function Card({ index, active, names, selection, orientation, func }: { index: number, active: boolean, names: {name: string, id: string}[], selection: string; orientation: string; func: (value: string, name: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, floatingStyles} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        placement: orientation as any,
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
        console.log('toggle')
    }
    function close(selection: string, player: string) {
        if (!active) return
        setIsOpen(false);
        func(selection, player);
    }

    return (
        <>
            <img
                ref={refs.setReference}
                className={`card ${orientation === "left" || orientation === "right" ? '' : 'inline'}`}
                src={`cards/${selection}.svg`}
                alt={selection}
                onClick={() => toggle()}
            />
            {isOpen && (
                <div ref={refs.setFloating} style={floatingStyles}>
                    <div>
                        {names
                            .filter((_, key) => key % 2 === ((index + 1) % 2))
                            .map((player, index) => (
                                <button
                                    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-1 mb-1 ml-1 mr-1 flex-1'
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

export function HHand({ index, deck, active, orientation, func }: { index: number; deck: { name: string; id: string; cards: string[] }[]; active: boolean; orientation: string; func: (value: string, player: string) => void }) {
    const player = deck[index];
    const names = deck.map(({name, id}) => ({name, id}));

    return (
        <div key={index} className='flex flex-col flex-1 items-center'>
            {orientation == "bottom" && <h1 className='text-4xl'>{player.name}</h1>}
            <div className={`hand hhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
                {player.cards.map((selection, _) => (
                    <Card
                        index={index}
                        active={active}
                        names={names}
                        selection={active ? selection : 'Blue_Back'}
                        orientation={orientation}
                        func={func}
                    />
                ))}
            </div>
            {orientation == "top" && <h1 className='text-4xl'>{player.name}</h1>}
        </div>
    );
}

export function VHand({ index, deck, active, orientation, func }: { index: number; deck: { name: string; id: string; cards: string[] }[]; active: boolean; orientation: string; func: (value: string, player: string) => void }) {
    const player = deck[index];
    const names = deck.map(({name, id}) => ({name, id}));

    return (
        <div key={index} className='flex flex-1 items-center'>
            {orientation == "right" && <div className="w-10"><h1 className='text-4xl mr-3 transform origin-center -rotate-90'>{player.name}</h1></div>}
            <div className={`hand vhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
                {player.cards.map((selection, index) => (
                    <Card
                        index={index}
                        active={active}
                        names={names}
                        selection={active ? selection : 'Blue_Back'}
                        orientation={orientation}
                        func={func}
                    />
                ))}
            </div>
            {orientation == "left" && <div className="w-10"><h1 className='text-4xl transform origin-center rotate-90'>{player.name}</h1></div>}
        </div>
    );
}
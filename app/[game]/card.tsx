export function Card({ selection, func }: { selection: string, func: (value: string) => void }) {
    function passer() {
        func(selection);
    }

    return (
            <img className='card inline' src={`cards/${selection}.svg`} alt={selection} onClick={passer} />
        );
}

export function HHand({ cards, active, func }: { cards: string[], active: boolean, func: (value: string) => void }) {
    return (
        <div className={`hand hhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
            {cards.map((selection, index) => <Card key={index} selection={active ? selection : 'Blue_Back'} func={func} />)}
        </div>
    );
}

export function VHand({ cards, active, func }: { cards: string[], active: boolean, func: (value: string) => void }) {
    return (
        <div className={`hand vhand${active ? '' : '-compact'} ${active ? 'active-hand' : ''}`}>
            {cards.map((selection, index) => <Card key={index} selection={active ? selection : 'Blue_Back'} func={func} />)}
        </div>
    );
}
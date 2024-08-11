'use client';

import Game from './game';
import Waiting from './waiting';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

export default function Handler({ game, name }: { game: string, name: string }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [deck, setDeck] = useState<{ name: string, id: string, cards: string[] }[]>([]);
    const [participants, setParticipants] = useState(0);
    const [halfSet1, setHalfSet1] = useState<string[]>([]);
    const [halfSet2, setHalfSet2] = useState<string[]>([]);
    const [socketId, setSocketId] = useState('');

    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');
    const [updates, setUpdates] = useState<string[]>([]);

    const [showConfetti, setShowConfetti] = useState(false);

    const halfSets8 = ['High Spades', 'Low Spades', 'High Clubs', 'Low Clubs', 'High Diamonds', 'Low Diamonds', 'High Hearts', 'Low Hearts', 'Aces/Jokers']

    const expandedHalfSets =   [[['8S', '8 of Spades'], ['9S', '9 of Spades'], ['TS', '10 of Spades'], ['JS', 'Jack of Spades'], ['QS', 'Queen of Spades'], ['KS', 'King of Spades']], 
                                [['2S', '2 of Spades'], ['3S', '3 of Spades'], ['4S', '4 of Spades'], ['5S', '5 of Spades'], ['6S', '6 of Spades'], ['7S', '7 of Spades']], 
                                [['8C', '8 of Clubs'], ['9C', '9 of Clubs'], ['TC', '10 of Clubs'], ['JC', 'Jack of Clubs'], ['QC', 'Queen of Clubs'], ['KC', 'King of Clubs']], 
                                [['2C', '2 of Clubs'], ['3C', '3 of Clubs'], ['4C', '4 of Clubs'], ['5C', '5 of Clubs'], ['6C', '6 of Clubs'], ['7C', '7 of Clubs']], 
                                [['8D', '8 of Diamonds'], ['9D', '9 of Diamonds'], ['TD', '10 of Diamonds'], ['JD', 'Jack of Diamonds'], ['QD', 'Queen of Diamonds'], ['KD', 'King of Diamonds']], 
                                [['2D', '2 of Diamonds'], ['3D', '3 of Diamonds'], ['4D', '4 of Diamonds'], ['5D', '5 of Diamonds'], ['6D', '6 of Diamonds'], ['7D', '7 of Diamonds']], 
                                [['8H', '8 of Hearts'], ['9H', '9 of Hearts'], ['TH', '10 of Hearts'], ['JH', 'Jack of Hearts'], ['QH', 'Queen of Hearts'], ['KH', 'King of Hearts']], 
                                [['2H', '2 of Hearts'], ['3H', '3 of Hearts'], ['4H', '4 of Hearts'], ['5H', '5 of Hearts'], ['6H', '6 of Hearts'], ['7H', '7 of Hearts']], 
                                [['AS', 'Ace of Spades'], ['AH', 'Ace of Hearts'], ['AD', 'Ace of Diamonds'], ['AC', 'Ace of Clubs'], ['JB', 'Black Joker'], ['JR', 'Red Joker']]]

    const { width, height } = useWindowSize()

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });

            socket.emit('joinroom', { game: game, name: name, id: socket.id });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport('N/A');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);
    
    function shuffle(array: string[]) {
        let product = array;
        let currentIndex = product.length;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [product[currentIndex], product[randomIndex]] = [
            product[randomIndex], product[currentIndex]];
        }

        return product
    }

    function shuffleDeck() {
        const fullDeck6 = ['AS', 'AH', 'AD', 'AC', '2S', '2H', '2D', '2C', '3S', '3H', '3D', '3C', '4S', '4H', '4D', '4C', '5S', '5H', '5D', '5C', '6S', '6H', '6D', '6C', '7S', '7H', '7D', '7C', '8S', '8H', '8D', '8C', '9S', '9H', '9D', '9C', 'TS', 'TH', 'TD', 'TC', 'JS', 'JH', 'JD', 'JC', 'QS', 'QH', 'QD', 'QC', 'KS', 'KH', 'KD', 'KC', 'JB', 'JR'];
        const fulldeck8 = ['2S', '2H', '2D', '2C', '3S', '3H', '3D', '3C', '4S', '4H', '4D', '4C', '5S', '5H', '5D', '5C', '6S', '6H', '6D', '6C', '7S', '7H', '7D', '7C', '8S', '8H', '8D', '8C', '9S', '9H', '9D', '9C', 'TS', 'TH', 'TD', 'TC', 'JS', 'JH', 'JD', 'JC', 'QS', 'QH', 'QD', 'QC', 'KS', 'KH', 'KD', 'KC'];
        
        if (deck.length === 6) {
            const shuffledDeck = shuffle(fullDeck6);
            const newDeck = 
                deck.map((player, index) => {
                    return {
                        name: player.name,
                        id: player.id,
                        cards: shuffledDeck.slice(index * 9, index * 9 + 9),
                    };
                })

            socket.emit('updateDeck', { game: game, deck: newDeck, participants: participants });
        } else if (deck.length === 8) {
            const shuffledDeck = shuffle(fulldeck8);
            const newDeck = 
                deck.map((player, index) => {
                    return {
                        name: player.name,
                        id: player.id,
                        cards: shuffledDeck.slice(index * 6, index * 6 + 6),
                    };
                })

            socket.emit('updateDeck', { game: game, deck: newDeck, participants: participants });
        }
    }

    function handleStartGame() {
        if (deck.length < participants) {
            alert('Not enough players');
            return;
        } else if (deck.length > participants) {
            alert('Too many players');
            return;
        }

        shuffleDeck();
        socket.emit('startgame', { game: game });
    }

    useEffect(() => {
        socket.on('joinroom', (data) => {
            const message = `${data.name} has joined the game`;
            setUpdates([...updates, message]);

            if (!gameStarted) {
                if (data.id === socket.id) {
                    setSocketId(data.id);
                }

                const newDeck = [...deck, { name: data.name, id: data.id, cards: [] }]
                setDeck(newDeck);

                if (data.id !== socketId) {
                    socket.emit('receiveDeck', { game: game, id: data.id, deck: newDeck, participants: participants});
                }
            }
        });

        socket.on('receiveDeck', (data) => {
            if (data.id === socketId && data.deck !== deck) {
                setDeck(data.deck);
                setParticipants(data.participants);
            }
        });

        socket.on('updateDeck', (data) => {
            setDeck(data.deck);
            setParticipants(data.participants);
        });

        socket.on('leaveroom', (data) => {
            const message = `${data} has left the game`;
            setUpdates([...updates, message]);
            
            if (!gameStarted) {
                setDeck(deck.filter((player) => player.id !== data));
            }
        });

        socket.on('cardtap', (data) => {
            const sourceName = deck.find((player) => player.id === data.id)?.name;
            const destinationName = deck.find((player) => player.id === data.destinationId)?.name;
            const message = `${sourceName} sent card ${data.card} to ${destinationName}`;
            setUpdates([...updates, message]);
        });

        socket.on('declare', (data) => {
            const name = deck.find((player) => player.id === data.id)?.name;
            const message = `${name} declared half set ${data.halfSet} ${data.correct ? 'correctly' : 'incorrectly'}`;
            setUpdates([...updates, message]);
            
            setShowConfetti(true);
    
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000);

            if (data.modulus === 0) {
                setHalfSet1([...halfSet1, data.halfSet]);
            } else {
                setHalfSet2([...halfSet2, data.halfSet]);
            }
        });

        socket.on('startgame', () => {
            setGameStarted(true);
        });

        return () => {
            socket.off('joinroom');
            socket.off('receiveDeck');
            socket.off('updateDeck');
            socket.off('leaveroom');
            socket.off('cardtap');
            socket.off('declare');
            socket.off('startgame');
        };
    });

    function handleCardTransfer(value: string, destinationId: string) {
        const newDeck = deck.map((player) => {
            if (player.id === destinationId) {
                return { name: player.name, id: player.id, cards: [...player.cards, value] };
            }

            if (player.id === socketId) {
                return { name: player.name, id: player.id, cards: player.cards.filter((card) => card !== value) };
            }

            return player;
        });

        socket.emit('cardtap', { game: game, id: socketId, card: value, destinationId: destinationId });
        socket.emit('updateDeck', { game: game, deck: newDeck, participants: participants });
    }

    function handleDeclare(value: string, modulus: number, correct: boolean) {
        const index = halfSets8.indexOf(value);
        console.log(index, value)
        const expandedHalfSet = expandedHalfSets[index].map((selection) => selection[0]);
        console.log(expandedHalfSet)

        const newDeck = deck.map((player) => {
            return { name: player.name, id: player.id, cards: player.cards.filter((card) => !expandedHalfSet.includes(card)) };
        })

        socket.emit('declare', { game: game, id: socketId, modulus: modulus, halfSet: value, correct: correct });
        socket.emit('updateDeck', { game: game, deck: newDeck, participants: participants });
    }

    return gameStarted ? (
            <main className=''>
                {showConfetti && <Confetti width={width} height={height} />}
                <Game 
                    id={socketId}
                    deck={deck} 
                    halfSet1={halfSet1}
                    halfSet2={halfSet2}
                    handleCardTransfer={handleCardTransfer}
                    handleDeclare={handleDeclare}
                />
                <div className='absolute top-0 left-0 w-full'>
                    <div className='flex flex-col w-1/4 h-full text-white'>
                        <h1 className='text-2xl'>Updates</h1>
                        <div className='flex-1 overflow-y-scroll'>
                            {updates.slice(-3).map((update, index) => (
                                <p key={index} className='text-sm'>{update}</p>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            ) : (
            <Waiting
                deck={deck}
                code={game}
                participants={participants}
                handleParticipantsChange={setParticipants}
                startGame={handleStartGame}
            />
            );
        
}

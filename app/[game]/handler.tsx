'use client';

import Game from './game';
import Waiting from './waiting';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import Cookies from 'js-cookie';

export default function Handler({ game, name }: { game: string, name: string }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [deck, setDeck] = useState<{ name: string, id: string, cards: string[] }[]>([]);
    const [participants, setParticipants] = useState(0);
    const [socketId, setSocketId] = useState('');

    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');
    const [updates, setUpdates] = useState<string[]>([]);

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

        socket.on('startgame', () => {
            setGameStarted(true);
        });

        return () => {
            socket.off('joinroom');
            socket.off('receiveDeck');
            socket.off('updateDeck');
            socket.off('leaveroom');
            socket.off('cardtap');
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

    return gameStarted ? (
        <Game 
            id={socketId}
            deck={deck} 
            handleCardTransfer={handleCardTransfer}
        />
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

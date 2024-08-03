"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Card, HHand, VHand }from "./card";
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Script from "next/script";

export default function Game({ params }: { params: { game: string } }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [name, setName] = useState('');
  const [updates, setUpdates] = useState<string[]>([]);

  const router = useRouter()

  useEffect(() => {
    const name = Cookies.get('name');
    if (name) {
      setName(name);
    } else {
        // Redirect the user to the home page if the name is not set
        router.push('/');
    }

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.emit("joinroom", {game: params.game, name: name});
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on('joinroom', (data) => { 
        const message = `${data.name} has joined the game`;
        setUpdates([...updates, message]);
    })

    socket.on('cardtap', (data) => {
        const message = `${data.name} has tapped a card ${data.card}`;
        setUpdates([...updates, message]);
    })
    })

    function handleCardTap(value: string) {
        socket.emit('cardtap', {game: params.game, name: name, card: value});
    }

  return (
    <div>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/cardsJS/dist/cards.min.css" />
        <Script src="https://unpkg.com/cardsJS/dist/cards.min.js"></Script>
        <p>Status: { isConnected ? "connected" : "disconnected" }</p>
        <p>Transport: { transport }</p>
        <p>Game Code: {params.game}</p>

        {/* <div className='flex flex-row'>
            <VHand cards={["7C", "8C", "9C", "10C", "JC"]} active={false} />
            <div className='flex flex-col'>
                <div>
                    <HHand cards={["2C", "3C", "4C", "5C", "6C"]} active={true} />
                    <HHand cards={["2C", "3C", "4C", "5C", "6C"]} active={false} />
                </div>
                <div>
                    <HHand cards={["2C", "3C", "4C", "5C", "6C"]} active={false} />
                    <HHand cards={["7C", "8C", "9C", "10C", "JC"]} active={false} />
                </div>
            </div>
            <VHand cards={["7C", "8C", "9C", "10C", "JC"]} active={false} />
        </div> */}

        <HHand cards={["2C", "3S", "4D", "5H", "6C", "7S", "8D", "9H", "10C", "JS", "QD", "KH", "AC"]} active={true} func={handleCardTap}/>

        <div>
            {updates.map((update, index) => <p key={index}>{update}</p>)}
        </div>
    </div>
  );
}
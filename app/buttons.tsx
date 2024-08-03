'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

// Modal component
type JoinModalProps = {
    joinCode: string;
    name: string;
    handleJoinInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleModalConfirm: () => void;
    handleModalClose: () => void;
};

const JoinModal = ({ joinCode, name, handleJoinInputChange, handleInputChange, handleModalConfirm, handleModalClose }: JoinModalProps) => {
    return (
        <div className="flex flex-col">
            <input
                type="text"
                placeholder='Name'
                value={name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                placeholder='Join Code'
                value={joinCode}
                onChange={handleJoinInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex">
                <button
                    onClick={handleModalConfirm}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2 mr-2 flex-1"
                >
                    Confirm
                </button>
                <button
                    onClick={handleModalClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md mt-2 flex-1"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

type CreateModalProps = {
    participants: number;
    name: string;
    handleParticipantsChange: (num: number) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleModalConfirm: () => void;
    handleModalClose: () => void;
};

const CreateModal = ({ participants, name, handleParticipantsChange, handleInputChange, handleModalConfirm, handleModalClose }: CreateModalProps) => {
    return (
        <div className="flex flex-col">
            <input
                type="text"
                placeholder='Name'
                value={name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex">
                <button
                    onClick={() => handleParticipantsChange(6)}
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2 mr-2 ${participants === 6 ? 'bg-blue-600' : ''}`}
                >
                    6 Participants
                </button>
                <button
                    onClick={() => handleParticipantsChange(8)}
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2 ${participants === 8 ? 'bg-blue-600' : ''}`}
                >
                    8 Participants
                </button>
            </div>
            <div className="flex">
                <button
                    onClick={handleModalConfirm}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-2 mr-2 flex-1"
                >
                    Confirm
                </button>
                <button
                    onClick={handleModalClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md mt-2 flex-1"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default function HandleJoinGame() {
    const [joinCode, setJoinCode] = useState('');
    const [name, setName] = useState('');
    const [participants, setParticipants] = useState(6);
    const [joinModal, showJoinModal] = useState(false);
    const [createModal, showCreateModal] = useState(false);

    useEffect(() => {
        const name = Cookies.get('name');
        if (name) {
            setName(name);
        }
    })

    const router = useRouter()

    function handleJoinInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setJoinCode(event.target.value);
    };

    function handleParticipantsChange(num: number) {
        setParticipants(num);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    };

    function handleJoinModalClose() {
        showJoinModal(false);
    };

    function handleCreateModalClose() {
        showCreateModal(false);
    }

    function handleJoinModalConfirm() {
        Cookies.set('name', name)
        if (joinCode && name) {
            const joinLink = `/${joinCode}`; // Assuming the join link follows the pattern '/game/{joinCode}/{name}'
            router.push(joinLink); // Redirect the user to the page with the join code and name
        }
        showJoinModal(false);
    };

    function handleCreateModalConfirm() {
        Cookies.set('name', name)
        if (participants && name) {
            // Create a new game with the specified number of participants and name
            const joinCode = Math.random().toString(36).substring(7); // Generate a random join code
            const joinLink = `/${joinCode}`; // Assuming the join link follows the pattern '/game/{joinCode}/{name}'
            router.push(joinLink); // Redirect the user to the page with the join code and name
        }
        showCreateModal(false);
    }

    return (
        <>
            <button className="bg-green-500 text-white px-4 py-2 mr-2" onClick={() => showCreateModal(true)}>New Game</button>
            {createModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 backdrop-filter backdrop-blur-sm">
                    <CreateModal
                        participants={participants}
                        name={name}
                        handleParticipantsChange={handleParticipantsChange}
                        handleInputChange={handleInputChange}
                        handleModalConfirm={handleCreateModalConfirm}
                        handleModalClose={handleCreateModalClose}
                    />
                </div>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={() => showJoinModal(true)}>Join Game</button>
            {joinModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 backdrop-filter backdrop-blur-sm">
                    <JoinModal
                        joinCode={joinCode}
                        name={name}
                        handleJoinInputChange={handleJoinInputChange}
                        handleInputChange={handleInputChange}
                        handleModalConfirm={handleJoinModalConfirm}
                        handleModalClose={handleJoinModalClose}
                    />
                </div>
            )}
        </>
    );
};

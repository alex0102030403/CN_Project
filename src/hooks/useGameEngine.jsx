import { useControls } from 'leva';
import { isHost, onPlayerJoin, useMultiplayerState, usePlayersList, getState , myPlayer} from 'playroomkit';
import React, { useState, useEffect, useRef } from 'react';


const GameEngineContext = React.createContext();

const TIME_PHASE_TALK = 2;
const TIME_PHASE_BATTLE = 6;
const TIME_PHASE_VOTE = 5;
const TIME_PHASE_END = 3;

const TOTAL_ATTACKS = 1;


let ONE_TIME = 1;

const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export const GameEngineProvider = ({ children }) => {

    const [timer, setTimer] = useMultiplayerState('timer', 0);
    const [round, setRound] = useMultiplayerState('round', 0);
    const [phase, setPhase] = useMultiplayerState('phase', 'talk');
    const [gameEndVar, setGameEndVar] = useMultiplayerState('gameEndVar', false);
    const [winnerTeam, setWinnerTeam] = useMultiplayerState('winnerTeam', '');

    const [roleListBlue, setRoleListBlue] = useMultiplayerState('roleListBlue', ['Soldier', 'Spy', 'Commander']);
    const [roleListRed, setRoleListRed] = useMultiplayerState('roleListRed', ['Soldier', 'Spy', 'Commander']);

    
    const [votes, setVotes] = useMultiplayerState('votes', []);
    const [votesCount, setVotesCount] = useMultiplayerState('votesCount', 0);
    const [actionSuccess, setActionSuccess] = useMultiplayerState('actionSuccess', true);

    const [redTeam, setRedTeam] = useMultiplayerState('redTeam', []);
    const [blueTeam, setBlueTeam] = useMultiplayerState('blueTeam', []);

    const [chatMessages, setChatMessages] = useMultiplayerState('chatMessages', []);

    //Each player will have the action to chose one player to chat with, when chose they will have a private chat, the other person if slower will have to wait for the other to chose him to chat

    const [playersChatList, setPlayersChatList] = useMultiplayerState('playersChatList', []);
    const [playerMessages, setPlayerMessages] = useMultiplayerState('playerMessages', []);

    const players = usePlayersList(true);
    //players.sort((a, b) => a.id - b.id);

    //Random sort of players 

    

    
    const gameEnd = () => {

        let redAlive = 0;
        let blueAlive = 0;

        for(let i = 0; i < players.length; i++) {
            if(players[i].getState('health') <= 0)
            {
                players[i].setState("isAlive",false, true);
            }
        }

        for(let i = 0; i < players.length; i++) {
            if(players[i].getState('team') == 'red' && players[i].getState('isAlive')) {
                redAlive++;
            }
            if(players[i].getState('team') == 'blue' && players[i].getState('isAlive')) {
                blueAlive++;
            }
        }

        if(redAlive == 0) {
            console.log('Blue team wins');
            setGameEndVar(true, true);
            setWinnerTeam('Blue');
        }
        else if(blueAlive == 0) {
            console.log('Red team wins');
            setGameEndVar(true, true);
            setWinnerTeam('Red');
            
        }
        else {
            console.log('Still Playing');
            
        }

    }
    
    const externSetRedTeam = (newRedTeam) => {
        setRedTeam(newRedTeam, true);
    }

    const externSetBlueTeam = (newBlueTeam) => {
        setBlueTeam(newBlueTeam, true);  
    }

    
    

    const gamePhases = ['talk', 'battle', 'action', 'end'];

    const startGame = () => {
        
        if( isHost() ) {

            let playersChat = [];

            players.sort(() => Math.random() - 0.5);
            ONE_TIME = 1;
            console.log('Starting game');
            setTimer(TIME_PHASE_TALK, true);
            //console.log(TIME_PHASE_TALK);
            setPhase('talk', true);
            setRound(1, true);
            setGameEndVar(false, true);
            setWinnerTeam('', true);
            setVotes([], true);
            setVotesCount(0, true);
            setActionSuccess(true, true);
            setChatMessages([], true);
            // setRoleListBlue(['Soldier', 'Spy', 'Commander'], true);
            // setRoleListRed(['Soldier', 'Spy', 'Commander'], true);
            //the structure for the chat will be Player1 : Player2
            //Or Player1 : None

           

            for(let i = 0; i < players.length; i++) {
                let name = players[i]?.state?.profile?.name;
                playersChat.push({
                    name: players[i]?.state?.profile?.name || "none", // Use the extracted name or fallback to "unknown"
                    chatPartner: "none" // Default value for chatPartner
                });
            }

            setPlayersChatList(playersChat, true);
            


            let redTeamPlayers = [];
            let blueTeamPlayers = [];

        if(ONE_TIME == 1) {

            let rolelistR = ['Soldier', 'Spy', 'Commander'];
            let rolelistB = ['Soldier', 'Spy', 'Commander'];
        
        for(let i = 0; i < players.length; i++) {
        if(i % 2 == 0) {
            
            let role = rolelistR[randInt(0, rolelistR.length - 1)];
            rolelistR = rolelistR.filter(r => r != role);
            console.log(rolelistR);
            setRoleListRed(rolelistR, true);
            redTeamPlayers.push({player: players[i], role: role, isAlive: true});
            players[i].setState("team", "red", true);
            players[i].setState("role", role, true);
            players[i].setState("isAlive", true , true);
            players[i].setState("message", "", true);   
            players[i].setState("health", 5, true);
            players[i].setState("totalDamage", 0, true);
            players[i].setState("attacks", 0, true);    

            }
        else {
                
                let role = rolelistB[randInt(0, rolelistB.length - 1)];
                rolelistB = rolelistB.filter(r => r != role);
                setRoleListBlue(rolelistB, true);
                blueTeamPlayers.push({player: players[i], role: role, isAlive: true});
                players[i].setState("team", "blue", true);
                players[i].setState("role", role, true);
                players[i].setState("isAlive", true , true);
                players[i].setState("message", "", true);
                players[i].setState("health", 5, true);
                players[i].setState("totalDamage", 0, true);
                players[i].setState("attacks", 0, true);

            }
        }
 
        setRedTeam(redTeamPlayers);
        setBlueTeam(blueTeamPlayers);
        ONE_TIME = 0;
        console.log("TEAM INITIALIZED");
        }

        
    }
    
    }   

    const gameState = {
        timer,
        round,
        phase,
        votes,
        votesCount,
        actionSuccess,
        players,
        redTeam,
        blueTeam,
        externSetRedTeam,
        externSetBlueTeam,
        chatMessages,
        setChatMessages,
        gameEnd,
        gameEndVar,
        winnerTeam,
        startGame,
        playersChatList,
        playerMessages,
        setPlayersChatList,
        setPlayerMessages,
    }

    useEffect(() => {
       
        startGame();
        
    }, []);

    

    const timeInterval = useRef();

    const phaseEnd = () => {
        console.log('Phase end');
        let nextPhase = gamePhases[(gamePhases.indexOf(phase) + 1) % gamePhases.length];
        if(nextPhase == 'action') {
            nextPhase = 'end';
        }
        setPhase(nextPhase, true);
        switch(nextPhase) {
            case 'talk':
                setTimer(TIME_PHASE_TALK, true);

                break;
            case 'battle':
                setTimer(TIME_PHASE_BATTLE, true);
                
                break;
            case 'action':
                setTimer(TIME_PHASE_VOTE, true);
                break;
            case 'end':

                for(let i = 0; i < players.length; i++) {
                    let damageTaken = players[i].getState('totalDamage');
                    let health = players[i].getState('health');
                    let newHealth = health - damageTaken;
                    players[i].setState('health', newHealth, true);
                    players[i].setState('attacks', 0, true);
                    players[i].setState('totalDamage', 0, true);
                }       
                gameEnd();
                
                setTimer(TIME_PHASE_END, true);
                setRound(round + 1, true);
                break;
        }
        
    }

    const clearTimer = () => {
        clearInterval(timeInterval.current);
    };

    useEffect(() => {
        console.log('Phase:', phase);
        runTimer();
        return clearTimer;
    }, [phase]);

    const runTimer = () => {
        
        timeInterval.current = setInterval(() => {
            if(!isHost()) {
                return;
            }
           
            
            let newTime = getState('timer') - 1;    
            console.log('Timer:', newTime);

            if(newTime <= 0) {
                phaseEnd();
            }
            else {
                setTimer(newTime,true);
            }

        }, 1000);
    }

    return (
        <GameEngineContext.Provider value={{
            ...gameState,

        }}>
            {children}
        </GameEngineContext.Provider>
    )
}
    

export const useGameEngine = () => {
    const context = React.useContext(GameEngineContext);
    if(context === undefined) {
        throw new Error('useGameEngine must be used within a GameEngineProvider');
    }
    return context;
}



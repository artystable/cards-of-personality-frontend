import React from 'react';
import styled from 'styled-components';
import {useDrop} from 'react-dnd';
import {MAX_PLAYERS} from '../constants';
import DraggableCard from './DraggableCard';
import {Confetti} from '../icons';

const PlayerName = styled.p`
  margin: 0px;
  position: absolute;
  top: 0;
  text-align: left;
  transform: translateY(-100%);
  color: black;
  font-weight: bold;
  width: 100%;
  padding: 0 0.5em 0.1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  z-index: 1;
  @media screen and (min-width: 1100px) {
    font-size: 16px;
  }
`;

const CardElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  border: 2px dashed #000;
  transition: background 0.25s, transform 0.25s;
`;

const Wrap = styled.div`
  position: relative;
  padding-bottom: 140%;
`;

const PlayerDropWrap = styled.div`
  position: relative;
  width: calc(25% - 1em);
  margin: 0.5em;

  @media (max-width: 500px) and (orientation: portrait) {
    max-width: calc(25vh - 50px - 1em);
  }

  @media (orientation: landscape) {
    max-width: calc(50vh - 50px - 4em);
  }

  &:nth-child(1n + ${MAX_PLAYERS / 2 + 1}) ${PlayerName} {
    transform: translateY(100%);
    bottom: 0;
    top: auto;
    padding-top: 0.1em;
  }
`;

const getPlayerName = ({index, myName, players, socket}) => {
  if (players[index].id === socket.id) {
    return myName;
  }
  if (players[index].name) {
    return players[index].name;
  }

  return `NEW USER`;
};

const getBlackCardLength = ({players, index}) => {
  if (players[index].blackCards && players[index].blackCards.length) {
    return `(${players[index].blackCards.length})`;
  }

  return '';
};

const PlayerDrop = ({
  index,
  winningPlayerIndex,
  myName,
  players,
  socket,
  addCardToPlayer,
  userIsDragging,
  setUserIsDragging,
  className,
  isMyCardsOpen,
  isSubmittedTableOpen,
}) => {
  const [{isOver}, drop] = useDrop({
    accept: ['blackCard', 'blackCardFromPlayer'],
    drop: (item) => {
      addCardToPlayer(item, players[index]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <PlayerDropWrap className={className}>
      <Wrap ref={drop}>
        <CardElement
          style={{
            background:
              userIsDragging === 'blackCard' ||
              userIsDragging === 'blackCardFromPlayer'
                ? '#2cce9f'
                : null,
            transform: isOver ? 'scale(1.05)' : null,
          }}
        >
          <PlayerName style={{margin: 0}}>{`${getBlackCardLength({
            players,
            index,
          })} ${getPlayerName({myName, players, index, socket})}`}</PlayerName>
        </CardElement>
        {index === winningPlayerIndex && <Confetti />}
      </Wrap>
      {players &&
        players[index] &&
        players[index].blackCards &&
        players[index].blackCards.map((blackCard) => (
          <div
            key={blackCard.text}
            style={{
              pointerEvents:
                userIsDragging === 'blackCard' ||
                userIsDragging === 'blackCardFromPlayer'
                  ? 'none'
                  : null,
            }}
          >
            <DraggableCard
              screen="main"
              flippedByDefault
              isFlippable={false}
              socket={socket}
              setUserIsDragging={setUserIsDragging}
              type="blackCardFromPlayer"
              isMyCardsOpen={isMyCardsOpen}
              isSubmittedTableOpen={isSubmittedTableOpen}
              {...blackCard}
            />
          </div>
        ))}
    </PlayerDropWrap>
  );
};

export default PlayerDrop;

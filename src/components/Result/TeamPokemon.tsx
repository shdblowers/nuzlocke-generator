import * as React from 'react';

import { Pokemon } from '../../models';
import { getBackgroundGradient } from './getBackgroundGradient';
import { getGenderElement } from './getGenderElement';
import { movesByType } from './movesByType';

const getMoveType = move => {
    for (const type in movesByType) {
        if (movesByType.hasOwnProperty(type)) {
            if (
                movesByType[type].some((value, index) => {
                    return move === value;
                })
            )
                return type;
        }
    }

    return 'Normal';
};

const generateMoves = moves => {
    return moves.map((move, index) => {
        move = move.trim();
        const type = getMoveType(move);
        return (
            <div key={index} className={`move ${type}-type`}>
                {move}
            </div>
        );
    });
};

export const TeamPokemon = (props: Pokemon) => {
    console.log(props);
    const poke = props;
    const moves =
        poke.moves == null ? '' : <div className='pokemon-moves'>{generateMoves(poke.moves)}</div>;
    const addForme = (species:string | undefined) => {
        if (poke.forme) {
            if (poke.forme === 'Alolan' || poke.forme === 'Alola') {
                return `alolan-${species}`;
            }

            return species;
        } else {
            return species;
        }
    };
    return (
        <div className='pokemon-container'>
            <div
                className='bubble'
                style={{
                    background: getBackgroundGradient(
                        poke.types != null ? poke.types[0] : '',
                        poke.types != null ? poke.types[1] : '',
                    ),
                }}>
                <div
                    style={{
                        backgroundImage: `url(img/${(
                            addForme(poke.species) || 'missingno'
                        ).toLowerCase()}.jpg)`,
                    }}
                    className={`pokemon-image ${(poke.species || 'missingno').toLowerCase()}`}
                />
            </div>
            <div className='pokemon-info'>
                <div className='pokemon-info-inner'>
                    <span className='pokemon-nickname'>{poke.nickname}</span>
                    <span className='pokemon-name'>{poke.species}</span>
                    {getGenderElement(poke.gender)}
                    <span className='pokemon-level'>lv. {poke.level}</span>
                    <br />
                    <span className='pokemon-location'>
                        { poke.met === 'Starter' ? poke.met : `Met on ${poke.met}`}, from lv. {poke.metLevel}
                    </span>
                    <br />
                    <span className='pokemon-nature'>
                        <strong>{poke.nature}</strong> nature
                    </span>
                    <br />
                    <span className='pokemon-ability'>{poke.ability}</span>
                </div>
                {moves}
            </div>
        </div>
    );
};

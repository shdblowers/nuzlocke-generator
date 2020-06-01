import * as React from 'react';
import { connect } from 'react-redux';
import {
    Button,
    ButtonGroup,
    Dialog,
    Callout,
    TextArea,
    Intent,
    Alert,
    Toaster,
    Switch,
} from '@blueprintjs/core';
import { PokemonIconBase } from 'components/PokemonIcon';
import { ErrorBoundary } from 'components/Shared';
import * as uuid from 'uuid/v4';
import { persistor } from 'store';
import { replaceState } from 'actions';
import { style } from 'reducers/style';
import { reducers } from 'reducers';
import { parseGen1Save, parseGen2Save } from 'parsers';
import converter from 'hex2dec';
import { Game, Pokemon } from 'models';
import { omit } from 'ramda';
import { BaseEditor } from 'components/BaseEditor';
import { State } from 'state';
import { noop } from 'redux-saga/utils';

const trash = require('assets/img/trash.png');

export interface DataEditorProps {
    state: State;
    replaceState: replaceState;
}

export interface DataEditorState {
    isOpen: boolean;
    isClearAllDataOpen: boolean;
    mode: 'import' | 'export';
    data: string;
    href: string;
    selectedGame: string;
    mergeDataMode: boolean;
}

const hexEncode = function (str: string) {
    let hex, i;

    let result = '';
    for (i = 0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += `000${hex}`.slice(-4);
    }

    return result;
};

const isValidJSON = (data: string): boolean => {
    try {
        JSON.parse(data);
        return true;
    } catch (e) {
        return false;
    }
};

export class DataEditorBase extends React.Component<DataEditorProps, DataEditorState> {
    public textarea: any;
    public fileInput: any;
    public nuzlockeJsonFileInput: any;

    public constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isClearAllDataOpen: false,
            mode: 'export',
            data: '',
            href: '',
            selectedGame: 'RBY',
            mergeDataMode: true,
        };
    }

    private uploadJSON = (e) => {
        if (isValidJSON(e.target.value)) {
            this.setState({ data: e.target.value });
        } else {
            const toaster = Toaster.create();
            toaster.show({
                message: 'Failed to parse invalid JSON',
                intent: Intent.DANGER,
            });
        }
    };

    private uploadNuzlockeJsonFile = (e) => {
        const file = this.nuzlockeJsonFileInput.files[0];
        const reader = new FileReader();

        reader.readAsText(file, 'utf-8');
        reader.addEventListener('load', (event) => {
            const file = event?.target?.result;
            const data = file;
            // @ts-ignore
            this.setState({ data });
        });
    };

    private confirmImport = (e) => {
        let cmm = { customMoveMap: [] };
        const data = JSON.parse(this.state.data);
        const safeguards = { customTypes: [], customMoveMap: [], stats: [] };
        if (!Array.isArray(data.customMoveMap)) {
            noop();
        } else {
            cmm = { customMoveMap: data.customMoveMap };
        }
        this.props.replaceState({ ...safeguards, ...data, ...cmm });
        this.writeAllData();
    };

    private importState = () => {
        this.setState({ mode: 'import' });
        this.setState({ isOpen: true });
    };

    private exportState = (state) => {
        this.setState({
            mode: 'export',
        });
        this.setState({ isOpen: true });
        this.setState({
            href: `data:text/plain;charset=utf-8,${encodeURIComponent(
                JSON.stringify(omit(['router', '._persist'], state)),
            )}`,
        });
    };

    private renderTeam(data) {
        let d;
        try {
            d = JSON.parse(data);
        } catch {
            d = { pokemon: false };
        }

        if (d.pokemon) {
            return (
                <div
                    className="team-icons"
                    style={{
                        background: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '.25rem',
                        margin: '.25rem',
                        marginTop: '.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    {d.pokemon
                        .filter((p) => p.status === 'Team')
                        .map((p) => {
                            return <PokemonIconBase key={p.id} {...p} />;
                        })}
                </div>
            );
        } else {
            return null;
        }
    }

    private static determineGame(isYellow: boolean): Game {
        if (isYellow) return { name: 'Yellow', customName: '' };
        return { name: 'Red', customName: '' };
    }

    private static pokeMerge = (pokemonListA: Pokemon[], pokemonListB: Pokemon[]) => {
        return pokemonListB.map((poke) => {
            const id = poke.id;
            const aListPoke = pokemonListA.find((p) => p.id === id);
            if (aListPoke) {
                return {
                    ...aListPoke,
                    ...poke,
                };
            } else {
                return poke;
            }
        });
    };

    private uploadFile = (replaceState, state) => (e) => {
        const file = this.fileInput.files[0];
        const reader = new FileReader();
        const componentState = this.state;

        reader.readAsArrayBuffer(file);

        reader.addEventListener('load', function () {
            const u = new Uint8Array(this.result as ArrayBuffer);

            const functionToUse =
                componentState.selectedGame === 'RBY'
                    ? parseGen1Save(u, 'nuzlocke')
                    : parseGen2Save(u, 'nuzlocke');

            functionToUse
                // @ts-ignore
                .then((res) => {
                    res.pokemon = res.pokemon.filter((poke) => poke.species);
                    const mergedPokemon = componentState.mergeDataMode
                        ? DataEditorBase.pokeMerge(state.pokemon, res.pokemon)
                        : res.pokemon;
                    const data = {
                        game: DataEditorBase.determineGame(res.isYellow),
                        pokemon: mergedPokemon,
                        trainer: res.trainer,
                    };
                    const newState = { ...state, ...data };

                    replaceState(newState);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    };

    private clearAllData = (e) => {
        persistor.purge();
        window.location.reload();
    };

    private writeAllData = () => {
        persistor.flush();
    };

    private toggleClearingData = (e) =>
        this.setState({ isClearAllDataOpen: !this.state.isClearAllDataOpen });

    private renderSaveFileUI() {
        return <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
                className="pt-label pt-inline"
                style={{ padding: '.25rem 0', paddingBottom: '.5rem' }}>
                <div className="pt-select">
                    <select
                        value={this.state.selectedGame}
                        onChange={(e) => this.setState({ selectedGame: e.target.value })}>
                        {['RBY'].map((game) => (
                            <option value={game}>{game}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div
                className="pt-label pt-inline"
                style={{
                    padding: '.25rem 0',
                    paddingBottom: '.5rem',
                    marginLeft: '.25rem',
                }}>
                <input
                    style={{ padding: '.25rem' }}
                    className="pt-button"
                    ref={(ref) => (this.fileInput = ref)}
                    onChange={this.uploadFile(this.props.replaceState, this.props.state)}
                    type="file"
                    id="file"
                    name="file"
                    accept=".sav"
                />
            </div>

            <div
                className="pt-label pt-inline"
                style={{
                    padding: '.25rem 0',
                    paddingBottom: '.5rem',
                    marginLeft: '.25rem',
                }}>
                <Switch
                    label='Merge Data?'
                    checked={this.state.mergeDataMode}
                    onChange={(e) =>
                        this.setState({ mergeDataMode: !this.state.mergeDataMode })
                    }
                />
            </div>
        </div>;
    }

    public render() {
        return (
            <BaseEditor name="Data">
                <Alert
                    onConfirm={this.clearAllData}
                    isOpen={this.state.isClearAllDataOpen}
                    onCancel={this.toggleClearingData}
                    cancelButtonText="Nevermind"
                    confirmButtonText="Delete Anyway"
                    className={this.props.state.style.editorDarkMode ? 'pt-dark' : 'pt-light'}
                    style={{ maxWidth: '600px' }}
                    intent={Intent.DANGER}>
                    <div style={{ display: 'flex' }}>
                        <img style={{ height: '10rem' }} src={trash} alt="Sad Trubbish" />
                        <p style={{ fontSize: '1.2rem', padding: '1rem' }}>
                            This will permanently delete all your local storage data, with no way to
                            retrieve it. Are you sure you want to do this?
                        </p>
                    </div>
                </Alert>
                <Dialog
                    isOpen={this.state.isOpen}
                    onClose={(e) => this.setState({ isOpen: false })}
                    title={
                        this.state.mode === 'export'
                            ? 'Exported Nuzlocke Save'
                            : 'Import Nuzlocke Save'
                    }
                    className={this.props.state.style.editorDarkMode ? 'pt-dark' : ''}
                    icon="floppy-disk">
                    {this.state.mode === 'export' ? (
                        <>
                            <Callout>Copy this and paste it somewhere safe!</Callout>
                            <div
                                style={{ height: '40vh', overflow: 'auto' }}
                                className="pt-dialog-body has-nice-scrollbars">
                                <span suppressContentEditableWarning={true} contentEditable={true}>
                                    {JSON.stringify(this.props.state, null, 2)}
                                </span>
                            </div>
                            <div className="pt-dialog-footer">
                                <a href={this.state.href} download={`nuzlocke_${uuid()}.json`}>
                                    <Button icon={'download'} intent={Intent.PRIMARY}>
                                        Download
                                    </Button>
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="pt-dialog-body has-nice-scrollbars">
                                <TextArea
                                    className="custom-css-input pt-fill"
                                    onChange={this.uploadJSON}
                                    placeholder="Paste nuzlocke.json contents here, or use the file uploader"
                                    value={this.state.data}
                                    large={true}
                                />
                                <ErrorBoundary>{this.renderTeam(this.state.data)}</ErrorBoundary>
                            </div>
                            <div className="pt-dialog-footer">
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <input
                                        style={{ padding: '.25rem' }}
                                        className="pt-button"
                                        ref={(ref) => (this.nuzlockeJsonFileInput = ref)}
                                        onChange={this.uploadNuzlockeJsonFile}
                                        type="file"
                                        id="jsonFile"
                                        name="jsonFile"
                                        accept=".json"
                                    />
                                    <Button
                                        icon="tick"
                                        intent={
                                            this.state.data === '' ? Intent.NONE : Intent.SUCCESS
                                        }
                                        onClick={this.confirmImport}
                                        disabled={this.state.data === '' ? true : false}
                                        text="Confirm"
                                        style={{
                                            marginLeft: 'auto',
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Dialog>

                <ButtonGroup>
                    <Button
                        onClick={(e) => this.importState()}
                        icon="import"
                        className="pt-intent-primary">
                        Import Data
                    </Button>
                    <Button onClick={(e) => this.exportState(this.props.state)} icon="export">
                        Export Data
                    </Button>
                    <Button
                        className="pt-minimal"
                        intent={Intent.SUCCESS}
                        onClick={this.writeAllData}
                        icon="floppy-disk">
                        Force Save
                    </Button>
                    {/* <Button icon='add' intent={Intent.SUCCESS}>
                        New Nuzlocke
                    </Button> */}
                </ButtonGroup>
                <Button
                    icon="trash"
                    onClick={this.toggleClearingData}
                    intent={Intent.DANGER}
                    className="pt-minimal">
                    Clear All Data
                </Button>
                {this.renderSaveFileUI()}
            </BaseEditor>
        );
    }
}

export const DataEditor = connect((state: State) => ({ state: state }), {
    replaceState,
})(DataEditorBase as any);

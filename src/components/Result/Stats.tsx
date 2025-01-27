import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'state';
import { PokemonIcon } from 'components/PokemonIcon';
import { Layout, LayoutDisplay } from 'components/Layout';
import { isLocal } from 'utils';

export interface StatsProps {
    pokemon: State['pokemon'];
    status?: string;
    stats?: State['stats'];
    style: State['style'];
}

export class StatsBase extends React.Component<StatsProps, { pokemon: State['pokemon'] }> {
    public static defaultProps = {
        status: 'Champs',
    };

    public state = {
        pokemon: [] as State['pokemon'],
    };

    public componentDidMount() {
        const { status } = this.props;
        const pokemon = this.props.pokemon.filter((p) => p.status === status);
        this.setState({ pokemon });
    }

    private typeMap() {
        const typesFreq = {};

        this.props.pokemon.forEach((poke) => {
            if (poke && Array.isArray(poke.types)) {
                const type1 = poke.types[0];
                const type2 = poke.types[1];

                if (typesFreq.hasOwnProperty(type1)) {
                    typesFreq[type1]++;
                } else {
                    typesFreq[type1] = 1;
                }

                if (typesFreq.hasOwnProperty(type2)) {
                    if (type1 !== type2) {
                        typesFreq[type2]++;
                    }
                } else {
                    typesFreq[type2] = 1;
                }
            }
        });

        return typesFreq;
    }

    private getMostCommonType() {
        const t = this.typeMap();
        const sorted = Object.keys(t)
            .map((key) => ({ name: key, total: t[key] }))
            .sort((a, b) => b.total - a.total);
        return [0, 1, 2, 3, 4, 5].map((n) => ({ name: sorted[n]?.name, total: sorted[n]?.total }));
    }

    private displayMostCommonType(data: { name?: string; total?: string }[]) {
        return data
            .filter((d) => d.name != null)
            .map((d) => `${d.name} (${d.total} Pokémon)`)
            .join(', ');
    }

    private wordMap(arr) {
        const wm = {};
        arr.forEach((key) => {
            if (
                key === 'from' ||
                key === 'the' ||
                key === 'a' ||
                key === 'on' ||
                key === 'up' ||
                key === 'with' ||
                key === 'to'
            ) {
                return;
            }
            if (wm.hasOwnProperty(key)) {
                wm[key]++;
            } else {
                wm[key] = 1;
            }
        });
        const sorted = Object.keys(wm)
            .map((key) => ({ name: key, total: wm[key] }))
            .sort((a, b) => b.total - a.total);
        return sorted;
    }

    private getMostCommonDeath() {
        const words = this.props.pokemon
            .filter((s) => s.status === 'Dead')
            .map((p) => p.causeOfDeath || '')
            .join('\n');
        const res = this.wordMap(words.split(/\n/));
        return [0, 1, 2, 3].map((i) => ({ name: res[i]?.name, total: res[i]?.total }));
    }

    private displayMostCommonDeath(data: { name?: string; total?: string }[]) {
        return data
            .filter((d) => d.name != null)
            .map((d) => `${d.name} (${d.total} deaths)`)
            .join(', ');
    }

    private getAverageLevel() {
        const pokes = this.props.pokemon.filter(p => !p.hidden);
        const levels = pokes.map((p) =>
            Number.isNaN(parseInt(p?.level as any)) ? 0 : parseInt(p?.level as any),
        );
        return (levels.reduce((p, c) => p + c, 0) / pokes.length).toFixed(0);
    }

    private getAverageLevelByStatus(status: string) {
        const pokes = this.props.pokemon.filter(p => !p.hidden && p.status === status);
        const levels = pokes.map((p) =>
            Number.isNaN(parseInt(p?.level as any)) ? 0 : parseInt(p?.level as any),
        );
        return (levels.reduce((p, c) => p + c, 0) / pokes.length).toFixed(0);
    }

    private getShinies() {
        if (!this.numberOfShinies) {
            return 'None';
        }
        return this.props.pokemon
            .filter((s) => s.shiny)
            .map((p) => <PokemonIcon shiny={p.shiny} species={p.species} id={p.id} />);
    }

    private numberOfShinies = this.props.pokemon.filter((s) => s.shiny).length;

    public render() {
        const { stats, style } = this.props;

        return (
            <div className="stats sstats-container">
                <h3 style={{ color: 'inherit' }}>Stats</h3>

                <div style={{ marginTop: '10px', margin: '0 10px' }}>
                    {style.statsOptions.averageLevel ? (
                        this.state.pokemon.length ? (
                            isLocal() ? <p>Average Level: Team ({this.getAverageLevelByStatus('Team')}), Boxed ({this.getAverageLevelByStatus('Boxed')}), Dead ({this.getAverageLevelByStatus('Dead')}), Champs ({this.getAverageLevelByStatus('Champs')})</p>
                                :
                                <div>Average Level: {this.getAverageLevel()}</div>
                        ) : null
                    ) : null}
                    {style.statsOptions.mostCommonKillers ? (
                        <div>
                            Most Common Killers:{' '}
                            {this.displayMostCommonDeath(this.getMostCommonDeath())}
                        </div>
                    ) : null}
                    {style.statsOptions.mostCommonTypes ? (
                        <div>
                            Most Common Types:{' '}
                            {this.displayMostCommonType(this.getMostCommonType())}
                        </div>
                    ) : null}
                    {style.statsOptions.shiniesCaught ? (
                        <div>
                            Shinies:{' '}
                            <Layout display={LayoutDisplay.Inline}>{this.getShinies()}</Layout>
                        </div>
                    ) : null}
                    {stats?.length
                        ? stats?.map((stat, idx) =>
                              stat.key?.length && stat.value?.length ? (
                                  <div key={stat.id}>
                                      {stat.key}: {stat.value}
                                  </div>
                              ) : null,
                          )
                        : null}
                </div>
            </div>
        );
    }
}

export const Stats = connect((state: State) => ({
    pokemon: state.pokemon,
    stats: state.stats,
    style: state.style,
}))(StatsBase as any);
